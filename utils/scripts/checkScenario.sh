
echo " --------------------------------";
echo " Testing your SmartContract .... ";
echo " --------------------------------";
printf "
 Test Summary : 
"
echo " ------------------";
./utils/smartpy-cli/SmartPy.sh test ./contract/ptplend.py ./test-build;
printf "
 Test Scenarios :
";
echo " -------------------"
cat ./test-build/P2PLend_interpreted/scenario-interpreter-log.txt;
printf "

"
