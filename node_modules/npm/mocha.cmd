@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\node_modules\mocha\bin\mocha" %*
) ELSE (
  node  "%~dp0\node_modules\mocha\bin\mocha" %*
)