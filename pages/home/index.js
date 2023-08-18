import { ActionIcon, BackgroundImage, Box, Button, Center, Container, Flex, Group, Image, Paper, Text, Title } from "@mantine/core";
import Head from "next/head";
import background from '@/public/doodle-pattern.png'
import logo from '@/public/logo.png'
import { IoMdLogIn } from "react-icons/io";
import { BsChevronCompactDown } from "react-icons/bs";
import Link from "next/link";
import { useScrollIntoView } from "@mantine/hooks";
import mockup from "@/public/blank-phone-mockup.png"

export default function Page() {
    return (
        <>
  <style
    dangerouslySetInnerHTML={{
      __html:
        '\nbody {\n  width: 100%;\n  height: 100%;\n  min-height: 100vh;\n  margin: 0;\n  font-family: \'Work Sans\', sans-serif;\n  font-weight: 400;\n}\n.background {\n  width: 100%;\n  height: 100%;\n  min-height: 100vh;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: -1;\n  background: #d4111b;\n  background: -moz-linear-gradient(top, #d4111b 0%, #7a090e 100%);\n  background: -webkit-linear-gradient(top, #d4111b 0%, #7a090e 100%);\n  background: linear-gradient(to bottom, #d4111b4 0%, #7a090e 100%);\n}\n.wrapper {\n  width: 80%;\n  height: 100%;\n  min-height: 800px;\n  background: #fff;\n  position: absolute;\n  left: 50%;\n  top: 0;\n  margin: 60px 0;\n  transform: translate(-50%, 0);\n  -webkit-transform: translate(-50%, 0);\n  -moz-transform: translate(-50%, 0);\n  -webkit-box-shadow: 0px 0px 30px 5px rgba(0,0,0,0.15);\n  -moz-box-shadow: 0px 0px 30px 5px rgba(0,0,0,0.15);\n  box-shadow: 0px 0px 30px 5px rgba(0,0,0,0.15);\n}\n.wrapper .header {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: #81a2ff;\n  background: -moz-linear-gradient(top, #81a2ff 0%, #c1e1ff 100%);\n  background: -webkit-linear-gradient(top, #81a2ff 0%, #c1e1ff 100%);\n  background: linear-gradient(to bottom, #ffffff 0%, #a70000  100%);\n  overflow: hidden;\n}\n.wrapper .header .logo {\n  width: 100px;\n  height: auto;\n  position: absolute;\n  top: 50px;\n  left: 100px;\n}\n.wrapper .header .menu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  line-height: 33px;\n  position: absolute;\n  top: 50px;\n  right: 100px;\n  text-align: right;\n  width: auto;\n}\n.wrapper .header .menu li {\n  display: inline-block;\n  margin: 0 10px;\n  color: #000;\n}\n.wrapper .header .content {\n  position: absolute;\n  width: 100%;\n  height: auto;\n  max-width: 800px;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -85%);\n}\n.wrapper .header .content h2 {\n  color: #fff;\n  margin: 0;\n  font-size: 2.3em;\n  line-height: 1.2em;\n  width: 100%;\n  text-align: center;\n}\n.wrapper .header .content .buttons {\n  width: 100%;\n  text-align: center;\n  margin: 0;\n  padding: 0;\n}\n.wrapper .header .content .button {\n  display: inline-block;\n  width: 150px;\n  height: 50px;\n  padding-left: 20px;\n  background: #000;\n  color: #fff;\n  font-size: 1.2em;\n  text-decoration: none;\n  text-align: center;\n  line-height: 50px;\n  margin: 40px 5px 0;\n  -moz-border-radius: 5px;\n  -webkit-border-radius: 5px;\n  border-radius: 5px;\n  -webkit-box-shadow: 0px 12px 20px -10px rgba(0,0,0,0.65);\n  -moz-box-shadow: 0px 12px 20px -10px rgba(0,0,0,0.65);\n  box-shadow: 0px 12px 20px -10px rgba(0,0,0,0.65);\n  transition: box-shadow 0.5s;\n}\n.wrapper .header .content .button:hover {\n  -webkit-box-shadow: 0px 0px 20px -10px rgba(0,0,0,0.65);\n  -moz-box-shadow: 0px 0px 20px -10px rgba(0,0,0,0.65);\n  box-shadow: 0px 0px 20px -10px rgba(0,0,0,0.65);\n  transition: box-shadow 0.5s;\n}\n.wrapper .header .content .button.apple {\n  background-image: url("http://vignette2.wikia.nocookie.net/respawnables/images/2/2f/Apple-logo-white-md.png/revision/latest?cb=20160224124036");\n  background-size: 20px auto;\n  background-repeat: no-repeat;\n  background-position: 20px center;\n}\n.wrapper .header .content .button.google {\n  background-image: url("http://vignette3.wikia.nocookie.net/starwars/images/e/ee/Google_Play_logo.png/revision/latest?cb=20141119230612");\n  background-size: 20px auto;\n  background-repeat: no-repeat;\n  background-position: 20px center;\n}\n.wrapper .header .waves {\n  width: calc(100% + 10px);\n  height: auto;\n  position: absolute;\n  bottom: -3px;\n  left: 50%;\n  transform: translate(-50%, 0);\n  -webkit-transform: translate(-50%, 0);\n  -moz-transform: translate(-50%, 0);\n  z-index: 0;\n}\n.wrapper .header .curve {\n  display: none;\n  width: calc(100% + 10px);\n  height: auto;\n  position: absolute;\n  bottom: -1px;\n  left: 50%;\n  transform: translate(-50%, 0);\n  -webkit-transform: translate(-50%, 0);\n  -moz-transform: translate(-50%, 0);\n  z-index: 1;\n}\n\n   .waves {fill: red};'
    }}
  />
  <div className="wrapper">
    <div className="header">
      <ul className="menu">
        <li>News</li>
        <li>Features</li>
        <li>How it works</li>
        <li>Blog</li>
      </ul>
      <div className="content">
        <h2>
        Découvrez Pace'sport, l'application qui fait gagner de l'argent à l'association sportive de votre ville !
        </h2>
        <div className="buttons">
          <a className="button apple" href="https://apps.apple.com/us/app/pacesport/id6450256567">
           App Store
          </a>
          <a className="button google" href="https://play.google.com/store/apps/details?id=com.eruditfrance.pacesport&hl=fr_FR">
           Google play
          </a>
          <a className="button PC" href="https://pacesport.fr/login">
           Continuer sur le navigateur
          </a>
        </div>
      </div>
      <img
        className="logo"
        src="http://pacesport.fr/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.b05a8a84.png&w=96&q=75"
      />
      <img
        className="curve"
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/626071/bottom-curve_copy.svg"
      />
      {/* <img
        className="waves"
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/626071/waves_copy.svg"
      /> */}
    </div>
  </div>
  <div className="background" />
</>

    );
  }
