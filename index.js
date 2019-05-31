const fs = require('fs');// fs stands for filesystem - it's an npm buit in. we are calling it using require
const http = require('http')// another npm built in, 
const json = fs.readFileSync(`${__dirname}/data/data.json`,`utf-8`);
const laptopData = JSON.parse(json);
const url = require('url');
//req is where the url is stored. the input
//res is what we want to do when someone access our server. the output
       const server = http.createServer((req,res)=>{// if someone try to access 127.0.0.1:1337 then this function works
       const pathname = url.parse(req.url, true).pathname;
    //    const query = url.parse(req.url,true).query; this code can be used to get all the info after the /
       const id = url.parse(req.url,true).query.id;   
   // console.log(typeof(id));
       //PRODUCTS OVERVIEW
       if (pathname === '/product' || pathname === '/'){
        res.writeHead(200,{'Content-type':'text/html'})
        fs.readFile(`${__dirname}/Templates/template-overview.html`,'utf-8',(err,data)=>{
           let overviewOutput = data;
            fs.readFile(`${__dirname}/Templates/template-card.html`,'utf-8',(err,data)=>{
                const cardOutput = laptopData.map(el=> replaceTemplate(data,el)).join("");
                  overviewOutput = overviewOutput.replace('{%CARDS%}',cardOutput);
                res.end(overviewOutput);
           })
        })
       }
       //LAPTOPS
       else if (pathname === '/laptop' && id< laptopData.length){
        res.writeHead(200,{'Content-type':'text/html'});
        fs.readFile(`${__dirname}/Templates/template-laptop.html`,'utf-8',(err,data)=>{
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            // //the replace method will return a new string so output will be data with product name we replaced
            // let output = data.replace(/{%PRODUCTNAME%}/g,laptop.productName);
            // //now when we want to replace the next place holder like image, we have to replace in output- not in data
            // //otherwise we would do it with data where the PRODUCTNAME was not changed 
            // output = output.replace(/{%IMAGE%}/g,laptop.image);
            // //replace also works on the first ocurance only so we need to use regex to solve that problem
            // // becuase we neet to replace more than on PRICE
            // output = output.replace(/{%PRICE%}/g,laptop.price);
            // output = output.replace(/{%SCREEN%}/g,laptop.screen);
            // output = output.replace(/{%CPU%}/g,laptop.cpu);
            // output = output.replace(/{%STORAGE%}/g,laptop.storage);
            // output = output.replace(/{%RAM%}/g,laptop.ram);
            // output = output.replace(/{%DESCREPTION%}/g,laptop.descreption);
             res.end(output);
        })
       }
       else if ((/\.(jpg|jpeg|gif|png)$/i).test(pathname)){
           fs.readFile(`${__dirname}/data/img${pathname}`,(err,data)=>{
               res.writeHead(200,{'Content-type':'image/jpg'});
               res.end(data);
           })
       }
       
       else{
           res.writeHead(404, {'Content-type':'text/html'});
           res.end("did not find the url");
       }
});
server.listen(1337,'127.0.0.1',()=>{
    console.log("this listening function is also working");
})
function replaceTemplate(originalHtml,laptop){

    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCREPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}