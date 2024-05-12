rm -rf ./mathjax.tgz
curl -o mathjax.tgz https://cdn.npmmirror.com/packages/mathjax/3.2.2/mathjax-3.2.2.tgz
rm -rf ./mathjax
mkdir mathjax
tar -xvf ./mathjax.tgz -C ./mathjax --strip-components 1
