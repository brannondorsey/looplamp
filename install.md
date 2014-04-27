# Looplamp Installation

1. [Download](http://www.raspberrypi.org/downloads/) the latest version of Raspbian. Follow the [Installing Operating System Images](http://www.raspberrypi.org/documentation/installation/installing-images/README.md) guide to get your Pi up and running.
2. Login to your Pi (username: "Pi", password: "Raspberry"). Type and enter:

	```
	sudo apt-get update
	```
	
	Once that is complete run:
	
	```
	sudo apt-get upgrade
	```
3. Download and install Node.js with:

	```
	wget http://node-arm.herokuapp.com/node_latest_armhf.deb
	sudo dpkg -i node_latest_armhf.deb
	```
4. Download the looplamp software:

	```
	git clone https://github.com/brannondorsey/looplamp.git
	```

5. Enable SPI Devices:

	```
	sudo nano /etc/modprobe.d/raspi-blacklist.conf
	```
	Change `spi-bcm2708` to `#spi-bcm2708`.
	
	```
	sudo reboot
	```
	
6. Start the looplamp server from inside of the looplamp folder:

	`./start.sh`
	
7. Use your lamp! Open a browser (on another computer) and type <http://looplamp.local> into the URL bar.

## Easy SSH access & Pretty URL

1. Change `raspberrypi` in `/etc/hosts` & `/etc/hostname` with `loop lamp`. Then run:

	```
	sudo /etc/init.d/hostname.sh
	sudo reboot
	```
2. Install avahi-daemon:

	```
	sudo apt-get install avahi-daemon
	```


You should now be able to ssh into your Pi with:

```
ssh pi@looplamp.local
```
You can also access your lamp's interface at <http://looplamp.local>.