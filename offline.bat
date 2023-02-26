@echo off
chcp 65001
cd offline
python main32.py
cd ..

cd dist_electron\win-ia32-unpacked
bamboo-drag.exe
cd ..\..
pause