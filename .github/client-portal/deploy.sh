#!/usr/bin/env bash
set -euo pipefail
umask 077
stage="$RUNNER_TEMP/client-report"
node .github/client-portal/decode.mjs "$RUNNER_TEMP/client-report-package.json" "$stage"
php -r '$p=file_get_contents($argv[1]); echo "prokatmaxim:".password_hash($p,PASSWORD_BCRYPT).PHP_EOL;' "$stage/password" > "$stage/access.htpasswd"
install -m 700 -d "$HOME/.ssh"
printf '%s\n' "$SSH_PRIVATE_KEY" > "$HOME/.ssh/id_ed25519"
printf '%s\n' "$SSH_KNOWN_HOSTS" > "$HOME/.ssh/known_hosts"
chmod 600 "$HOME/.ssh/id_ed25519" "$HOME/.ssh/known_hosts"
remote='i54914@i54914.hostru05.fornex.org'
sshargs=(-p 20022 -o BatchMode=yes -o IdentitiesOnly=yes -i "$HOME/.ssh/id_ed25519")
scpArgs=(-P 20022 -o BatchMode=yes -o IdentitiesOnly=yes -i "$HOME/.ssh/id_ed25519")
base='/home/i54914/public_html/manul.studio/clients/prokatmaxim'
ssh "${sshargs[@]}" "$remote" 'set -eu; p=/home/i54914/public_html/manul.studio/clients/prokatmaxim; test ! -e "$p" || test -f "$p/.client-portal-managed"; mkdir -p /home/i54914/.client-access /home/i54914/.deploy-backups/client-portals; chmod 700 /home/i54914/.client-access; if test -d "$p"; then stamp=$(date -u +%Y%m%dT%H%M%SZ); tar -czf "/home/i54914/.deploy-backups/client-portals/prokatmaxim-$stamp.tar.gz" -C "$p" .; if test -f /home/i54914/.client-access/prokatmaxim.htpasswd; then cp /home/i54914/.client-access/prokatmaxim.htpasswd "/home/i54914/.deploy-backups/client-portals/prokatmaxim-$stamp.htpasswd"; fi; fi; mkdir -p "$p"; touch "$p/.client-portal-managed"'
scp "${scpArgs[@]}" "$stage/access.htpasswd" "$remote:/home/i54914/.client-access/prokatmaxim.htpasswd"
ssh "${sshargs[@]}" "$remote" 'chmod 600 /home/i54914/.client-access/prokatmaxim.htpasswd'
scp "${scpArgs[@]}" .github/client-portal/client.htaccess "$remote:$base/.htaccess"
url='https://manul.studio/clients/prokatmaxim/'
# Fail closed before uploading any report data.
status=$(curl -sS --max-time 30 -D "$stage/anonymous.headers" -o /dev/null -w '%{http_code}' "$url")
test "$status" = 401 || { echo "Authentication guard failed: $status"; exit 1; }
grep -iq 'x-robots-tag:.*noindex' "$stage/anonymous.headers"
rsync -az --delete --exclude='.htaccess' --exclude='.client-portal-managed' -e "ssh -p 20022 -o BatchMode=yes -o IdentitiesOnly=yes -i $HOME/.ssh/id_ed25519" "$stage/public/" "$remote:$base/"
printf 'user = "prokatmaxim:%s"\n' "$(cat "$stage/password")" > "$stage/auth.curl"
for path in '' report.html report.json; do
 test "$(curl -sS --max-time 40 -o /dev/null -w '%{http_code}' "$url$path")" = 401
 test "$(curl -sS --max-time 40 --user prokatmaxim:incorrect-test-password -o /dev/null -w '%{http_code}' "$url$path")" = 401
 test "$(curl -sS --max-time 40 --config "$stage/auth.curl" -D "$stage/auth.headers" -o /dev/null -w '%{http_code}' "$url$path")" = 200
 grep -iq 'x-robots-tag:.*noindex' "$stage/auth.headers"
 grep -iq 'cache-control:.*no-store' "$stage/auth.headers"
done
capture=$(node -e 'const r=require(process.argv[1]);process.stdout.write(r.manifest[0].path)' "$stage/public/report.json")
test "$(curl -sS --max-time 30 -o /dev/null -w '%{http_code}' "$url$capture")" = 401
test "$(curl -sS --max-time 30 --config "$stage/auth.curl" -o /dev/null -w '%{http_code}' "$url$capture")" = 200
curl -fsS --max-time 30 --config "$stage/auth.curl" "$url" > "$stage/published.html"
cmp "$stage/published.html" "$stage/public/index.html"
echo 'Client portal verified: anonymous/wrong password denied, authorized report and evidence available, noindex and no-store enforced.'
echo 'Client URL: https://manul.studio/clients/prokatmaxim/' >> "$GITHUB_STEP_SUMMARY"
