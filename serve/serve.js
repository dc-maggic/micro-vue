const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs')
const config = {
	basepath: process.cwd()+'/dist',
	router: {
		resource: /^\/dist\/.*$/
	},
	port: 8800
};
const contentType = {
	html: 'text/html',
	htm: 'text/html',
	js: 'application/javascript',
	css: 'text/css',
	png: 'image/png',
	jpeg: 'image/jpeg',
	jpg: 'image/jpeg',
	json: 'application/json'
}
const response = (res, status, result, type) => {
	res.statusCode = status || 500;
	let stream;
	switch(type){
		case 'file':
        	res.setHeader('Content-Type', contentType[path.extname(result).slice(1)] + '; charset=utf-8');
            stream = fs.createReadStream(result);
			stream.pipe(res);
            stream.on('end', () => {
                res.end();
            });
            stream.on('error', () => {
                res.end();
            });
            break;
        case 'json':
        	res.setHeader('Content-Type', contentType['json'] + '; charset=utf-8');
            if (typeof result === 'object') {
                result = JSON.stringify(result);
            };
            res.write(result);
            res.end();
            break;
        case 'error':
        	res.end();
        	return;
	}
}
isFile = (filepath) => {
    try{
        return fs.statSync(filepath).isFile();
    }catch(e){}
    return false;
}

const server = http.createServer((req, res) => {
	let urlObj = url.parse(req.url),
        pathname = '';
	if (urlObj.pathname === '/' || urlObj.pathname.endsWith('.html')) {
        let html = 'index.html';
		pathname = path.normalize(`${config.basepath}/${html}`);
	// 静态资源
	} else{
        pathname = path.normalize(`${config.basepath}${urlObj.pathname}`);
	// 数据获取或操作
    };

	if (isFile(pathname)) {
		response(res, 200, pathname, 'file');
	} else {
		response(res, 404, '文件未找到', 'error');
	}
});

server.listen(config.port);