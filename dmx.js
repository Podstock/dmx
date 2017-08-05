const path = require('path');
const streamDeck = require('elgato-stream-deck');

var menu = 0;
var led1 = {offset: 1, ch: [0,0,0,0,0]};
var led2 = {offset: 6, ch: [0,0,0,0]};

var options = {                                
	            host: '192.168.0.99',              
}   
var artnet = require('artnet')(options);

streamDeck.on('down', keyIndex => {
	mymenu(keyIndex);
});
 
streamDeck.on('up', keyIndex => {
});
 
streamDeck.on('error', error => {
    console.error(error);
});

function mymenu(key) {

	console.log(key);
	if (menu == 0 && key == 4) {
		menu = 1;
		menu_display_led1();
		return;
	}
	if (menu == 0 && key == 3) {
		menu = 2;
		menu_display_led2();
		return;
	}
	if (key == 10) {
		menu = 0;
		main_menu();
		return;
	}

	//submenu
	if (menu == 1) {
		key_led(led1, key, 0);
	}

	if (menu == 2) {
		key_led(led2, key, 1);
	}
}


function main_menu() {
	reset();
	streamDeck.fillColor(4, 255, 0, 0);
	streamDeck.fillColor(3, 255, 255, 255);
	/*
	streamDeck.fillImageFromFile(3, path.resolve(__dirname, 'github_logo.png')).then(() => {
		console.log('Successfully wrote a GitHub logo to key 3.');
	});
	*/
}


function key_led(led, key, type) {
		if (type == 0) {
			ch=1;
		} else {
			ch=0;
		}

		switch(key) {
			case 9:
				setled(led, ch);
				break;
			case 8:
				setled(led, ch+1);
				break;
			case 7:
				setled(led, ch+2);
				break;
			case 6:
				if (type == 1) {
					if (led["ch"][3] == 0) {
						led["ch"][0] = 0;
						led["ch"][1] = 0;
						led["ch"][2] = 0;
						led["ch"][3] = 128;
					} else {
						led["ch"][0] = 0;
						led["ch"][1] = 0;
						led["ch"][2] = 0;
						led["ch"][3] = 0;
					}
				}
				break;
			case 11:
				if (type == 1) {
					led["ch"][3] = brightness(led["ch"][3] - 20);
				}
				break;
			case 1:
				if (type == 1) {
					led["ch"][3] = brightness(led["ch"][3] + 20);
				}
				break;
			default:
				return;
		}

		console.log(led);
		artnet.set(led["offset"], led['ch']);
}

function setled(led, ch) {
	if (led["ch"][ch] == 255) {
		led["ch"][ch] = 0;
	} else {
		led["ch"][ch] = 255;
	}
}

function brightness(value) {
	if (value > 255) {
		return 255;
	}
	if (value < 0) {
		return 0;
	}
	return value;
}

function menu_display_led1() {
	reset();
	streamDeck.fillColor(9, 255, 0, 0);
	streamDeck.fillColor(8, 0, 255, 0);
	streamDeck.fillColor(7, 0, 0, 255);
}

function menu_display_led2() {
	reset();
	streamDeck.fillColor(9, 255, 0, 0);
	streamDeck.fillColor(8, 0, 255, 0);
	streamDeck.fillColor(7, 0, 0, 255);
	streamDeck.fillColor(6, 255, 255, 255);
}

function reset() {
	for (i = 0; i < 15; i++) {
		streamDeck.fillColor(i, 0, 0, 0);
	}
}

reset();
main_menu();
