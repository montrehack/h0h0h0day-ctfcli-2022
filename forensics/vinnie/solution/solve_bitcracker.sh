#!/bin/bash
# NOTE: the bitcracker binaries were build for a pascal NVIDIA GPU, see the original repo for instructions how to build your own version
set -e

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

./bin/bitcracker_hash -o . -i ../blackmail.img
node ./bin/genkeys.js '148???-135938-14181?-361053-??8952-185438-189??7-069366' | shuf > keys.txt
./bin/bitcracker_cuda -f hash_recv_pass.txt -d keys.txt -t 1 -b 1 -g 0 -r
rm keys.txt hash_user_pass.txt hash_recv_pass.txt

echo "Please input the password found: "
read password

mkdir dislocker_loop dislocker_mount || true
dislocker -r -p$password -V ../blackmail.img -- dislocker_loop
mount -o loop ./dislocker_loop/dislocker-file ./dislocker_mount

echo
echo "The flag should be within the video in the dislocker_mount folder"
echo "When done, run 'sudo sh -c \"umount dislocker_mount dislocker_loop; rmdir dislocker_mount dislocker_loop\"'"
echo

