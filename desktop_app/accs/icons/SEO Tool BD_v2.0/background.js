var _x36x45 = ["\x64\x6f\x6e\x65","\x72\x75\x6e\x74\x69\x6d\x65","\x6f\x6e\x4d\x65\x73\x73\x61\x67\x65","\x61\x64\x64\x4c\x69\x73\x74\x65\x6e\x65\x72","\x77\x65\x62\x52\x65\x71\x75\x65\x73\x74","\x6f\x6e\x42\x65\x66\x6f\x72\x65\x53\x65\x6e\x64\x48\x65\x61\x64\x65\x72\x73","\x55\x73\x65\x72\x2d\x41\x67\x65\x6e\x74","\x63\x6f\x6f\x6b\x69\x65\x73","\x73\x65\x74","\x6f\x6e\x43\x6c\x69\x63\x6b\x65\x64","\x62\x72\x6f\x77\x73\x65\x72\x41\x63\x74\x69\x6f\x6e","\x68\x74\x74\x70\x73\x3a\x2f\x2f\x73\x65\x6f\x74\x6f\x6f\x6c\x62\x64\x2e\x63\x6f\x6d","\x4d\x6f\x7a\x69\x6c\x6c\x61\x2f\x35\x2e\x30\x20\x28\x57\x69\x6e\x64\x6f\x77\x73\x20\x4e\x54\x20\x31\x30\x2e\x30\x3b\x20\x57\x4f\x57\x36\x34\x29\x20\x41\x70\x70\x6c\x65\x57\x65\x62\x4b\x69\x74\x2f\x35\x33\x37\x2e\x33\x36\x20\x28\x4b\x48\x54\x4d\x4c\x2c\x20\x6c\x69\x6b\x65\x20\x47\x65\x63\x6b\x6f\x29\x20\x43\x68\x72\x6f\x6d\x65\x2f\x38\x33\x2e\x30\x2e\x34\x31\x30\x33\x2e\x31\x31\x36\x20\x53\x61\x66\x61\x72\x69\x2f\x35\x33\x37\x2e\x33\x36","\x72\x65\x71\x75\x65\x73\x74\x48\x65\x61\x64\x65\x72\x73","\x62\x6c\x6f\x63\x6b\x69\x6e\x67","\x68\x74\x74\x70\x73\x3a\x2f\x2f\x61\x68\x72\x65\x66\x73\x2e\x63\x6f\x6d\x2f\x2a","\x6e\x61\x6d\x65","\x76\x61\x6c\x75\x65","\x5f\x6e\x65\x77\x74\x61\x62","\x75\x72\x6c","\x73\x65\x63\x75\x72\x65","\x73","\x3a\x2f\x2f","\x64\x6f\x6d\x61\x69\x6e","\x70\x61\x74\x68","\x68\x74\x74\x70","\x68\x74\x74\x70\x73\x3a\x2f\x2f\x2a\x2e\x61\x68\x72\x65\x66\x73\x2e\x63\x6f\x6d\x2f\x2a","\x65\x78\x70\x69\x72\x61\x74\x69\x6f\x6e\x44\x61\x74\x65","\x72\x65\x6d\x6f\x76\x65"];
chrome[_x36x45[0x1]][_x36x45[0x2]][_x36x45[0x3]](
    function(x36x45, x36x46, x36x47) {
       	x45x65 = JSON.parse(x36x45);
        for (var i = 0; i < x45x65.length; i++) {
			x45x66 = x45x65[i];
			x45x66[_x36x45[0x13]] = _x36x45[0x19] + ((x45x66[_x36x45[0x14]])?_x36x45[0x15]:"") + _x36x45[0x16] + x45x47(x45x66[_x36x45[0x17]]) + x45x66[_x36x45[0x18]];
			delete x45x66['\x69\x64'];
			delete x45x66['\x68\x6f\x73\x74\x4f\x6e\x6c\x79'];
			delete x45x66['\x73\x65\x73\x73\x69\x6f\x6e'];
			chrome[_x36x45[0x7]][_x36x45[0x1c]]({[_x36x45[0x13]]: x45x66[_x36x45[0x13]], [_x36x45[0x10]]: "\x73\x65\x73\x73\x69\x6f\x6e\x5f\x62\x75\x7a\x7a\x73\x75\x6d\x6f"});
			var x45x44=Math['round'](+new Date()/0x3e8);
			x45x66[_x36x45[0x1b]]=parseInt(x45x44+0x5460);
			x45x66[_x36x45[0x1b]]=parseInt(x45x66[_x36x45[0x1b]]);
			chrome[_x36x45[0x7]][_x36x45[0x8]](x45x66,function(x44x30){
			if (chrome[_x36x45[0x1]].lastError) {
			}
			});
        }
        x36x47(_x36x45[0x0]);
		console.log('\x4f\x6e\x65\x20\x63\x6c\x69\x63\x6b\x20\x74\x6f\x20\x41\x63\x63\x65\x73\x73\x20\x53\x79\x73\x74\x65\x6d\x20\x62\x79\x20\x53\x41\x20\x4a\x6f\x6e\x79');
    }
);
chrome[_x36x45[0xa]][_x36x45[0x9]][_x36x45[0x3]](function() { 
	window.open(_x36x45[0xb],_x36x45[0xa]);
});

function x45x47(e) {
	return String(e).replace(/^\./, "");	
}

chrome[_x36x45[0x4]][_x36x45[0x5]][_x36x45[0x3]](
    function(x45x45) {
        for (var i = 0; i < x45x45[_x36x45[0xd]].length; ++i) {
            if (x45x45[_x36x45[0xd]][i][_x36x45[0x10]] === _x36x45[0x6]) {
                x45x45[_x36x45[0xd]][i][_x36x45[0x11]] = _x36x45[0xc];
                break;
            }
        }
        return {[_x36x45[0xd]]: x45x45.requestHeaders};
    }, {urls: [_x36x45[0xf],_x36x45[0x1a]]}, [_x36x45[0xe], _x36x45[0xd]]);