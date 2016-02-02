
A GUI to configure a [Literal Extraction Transformer](/fusepoolP3/p3-literal-extraction-transformer).

Compile with

    mvn install


and start with

    cd target
    java -jar p3-literal-extraction-transformer-factory-gui-*-jar-with-dependencies.jar


Now you should be able to access the service at:

    http://localhost:8202/?transformerBase=http://sandbox.fusepool.info:8192/&transformerRegistry=http://sandbox.fusepool.info:8181/ldp/tr-ldpc#
