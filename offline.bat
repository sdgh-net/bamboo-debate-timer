@echo off
chcp 65001
cd offline
python main32.py
cd ..

copy *.txt dist_electron\win-ia32-unpacked\
copy *.txt dist_electron\win-unpacked\
cd dist_electron\win-ia32-unpacked
for /f "delims=" %%i in ('dir /b /s /a-d "locales\*.pak"') do (
    if "%%~nxi" neq "zh-CN.pak" (
        del /f /q "%%i"
    )
)
cd ..\win-unpacked
for /f "delims=" %%i in ('dir /b /s /a-d "locales\*.pak"') do (
    if "%%~nxi" neq "zh-CN.pak" (
        del /f /q "%%i"
    )
)
bamboo-drag.exe
cd ..\..
pause