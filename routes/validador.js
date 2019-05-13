const express = require('express');
const router = express.Router();
const https = require('https');
const querystring = require('querystring');
const cheerio = require('cheerio')

router.get('/', (req, res) => {
    res.render('formxml', { title: 'Express' });
})

/* GET users listing. */
router.post('/', (req, res) => {

    var data = querystring.stringify({
        txtxml: req.body.txtxml
      });

    var options = {
        host: 'www.sefaz.rs.gov.br',
        path: '/NFE/NFE-VAL.aspx',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    var htmlResponse = ""
    
    var request = https.request(options, function(response) {
        response.setEncoding('utf8');
        //response.useChunkedEncodingByDefault = false;

        response.on('data', function (chunk) {
            //console.log("body: " + chunk);        
            htmlResponse += chunk;
            //res.write(chunk);
        });

        response.on('end', ()=>{
            const $ = cheerio.load(htmlResponse)
            console.log($('#resultado').html());
//            res.write();
            res.render('formxmlretorno', { conteudo: $('#resultado').html() })
            //res.end();
        })
    });

    request.write(data);
    request.end();
});

module.exports = router;
