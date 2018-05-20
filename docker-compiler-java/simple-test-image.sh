COMPILECODE=`cat JavaContract.java | base64 -w 0`
docker run --rm  -e COMPILECODE=$COMPILECODE docker-java-neo-compiler #> output_teste.txt
#cat output_teste.txt
#cat output_teste.txt | cut -c14- | rev | cut -c24- | rev | base64 --decode
