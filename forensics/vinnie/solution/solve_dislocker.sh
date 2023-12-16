#!/bin/bash
# NOTE: this is a easier but slower version, should take up to 30 mins

if [ "$UID" -ne 0 ]; then
  echo "Re-running this script as root"
  sudo -k "$0" "$@"
  exit $?
fi

if [ ! -f "../blackmail.img" ]; then
  echo "missing challenge bitlocker image"
  exit 1
fi

if [ -e "./dislocker_loop/dislocker-file" ]; then
  echo "bitlocker partition already mounted"
  exit 1
fi

if ! command -v dislocker >/dev/null; then
  echo "missing dislocker command"
  exit 1
fi

mkdir dislocker_loop dislocker_mount 2>/dev/null || true

MAX_TASKS=$((`nproc` * 2))

rm .found 2>/dev/null
node ./bin/genkeys.js '148???-135938-14181?-361053-??8952-185438-189??7-069366' | shuf | \
  while read key; do
    ((i=i%MAX_TASKS)); ((i++==0)) && wait
    if [ -f ".found" ]; then
      break
    fi

    {
      if dislocker -r -p$key -V ../blackmail.img -- dislocker_loop >/dev/null; then
        echo "Found valid key: $key"
        touch .found
      fi
    } &
  done
wait
rm .found 2>/dev/null

mount -o loop ./dislocker_loop/dislocker-file ./dislocker_mount

echo
echo "The flag should be within the video in the dislocker_mount folder"
echo "When done, run 'sudo sh -c \"umount dislocker_mount dislocker_loop; rmdir dislocker_mount dislocker_loop\"'"
echo

