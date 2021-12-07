import React, { useState, useEffect } from 'react';
import Kysymykset1 from './Kysymykset1';



import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';






var vastaus1 = {teksti:"Sitä, kuinka kaukaa muuttuja näkyy ilman kaukoputkea tai kiikareita", valittu:false}
var vastaus2 = {teksti:"Sitä, missä kohtaa ohjelmaa muuttujaa voi käyttää", valittu:false}
var vastaus3 = {teksti:"Sitä, miten helppo muuttujien käyttöä on synkronoida säikeiden kesken", valittu:false}
var vastaus4 = {teksti:"Sitä, miten helppo muuttujia on käyttää eri ohjelman osista", valittu:false}
var vastaus5 = {teksti: "Sitä, miten helppo muuttujien käyttöä on synkronoida säikeiden kesken", valittu:false}

var vastaus6 = {teksti:"niiden avulla koodia on helpompi moduloida", valittu:false}
var vastaus7 = {teksti:"niden avulla on helppo uudelleenkäyttää ohjelmakoodia", valittu:false}
var vastaus8 = {teksti:"niiden avulla on helppo kirjoittaa koodia, joka tukee hyvin kompositiota", valittu:false}
var vastaus9 = {teksti:"ne tarjoavat hyvän abstraktion kaikkeen mahdolliseen", valittu:false}
var vastaus10 = {teksti:"niiden avulla on helppo kirjoittaa monisäikeisiä sovelluksia", valittu:false}


var kysymys1 = {
  teksti:"Mitä muuttujan näkyvyysalue tarkoittaa?",
  vastaukset: [vastaus1,vastaus2,vastaus3,vastaus4,vastaus5]
  
}

var kysymys2 = {
  teksti:"Luokkien hyvä puoli on, että",
  vastaukset: [vastaus6,vastaus7,vastaus8,vastaus9,vastaus10]
  
}

const ten = {otsikko:"Kysely", kysymykset: [kysymys1,kysymys2]}

const t_json = JSON.stringify(ten);

localStorage.setItem("alkutila", t_json);
var t = "";


if (localStorage.getItem("kysely") == null) {
  t = JSON.parse(localStorage.getItem("alkutila"));
} else {
  t = JSON.parse(localStorage.getItem("kysely"))
}




const Tentti1=(props)=> {

  
  
  console.log("tentti:", props.tentti)
  return (
    
      <div>
        <div style={{color: "white", fontWeight:"bolder", fontSize:"xx-large", padding:"0", textAlign: "center"}}>{props.tentti.otsikko}</div>
        
        <div style={{marginTop:"30px", marginLeft:"-80px"}}> {props.tentti.kysymykset.map((item, index) => <Kysymykset1 key={index} kysymys={item} 
              kysymysIndex={index} Dispatch={props.Dispatch} tentti={props.tentti} />)} 
              
        </div>  <br></br>
          
         
         
        
        
        <br></br><Button style={{maxWidth: '170px', maxHeight: '25px', minWidth: '120px', minHeight: '25px', 
          marginLeft: "-15px"}} variant="contained" color="success" onClick={() => props.Dispatch({type: "LISÄÄ_KYSYMYS"})}>Lisää kysymys</Button>
        <br></br>
        <Button style={{borderRadius: "5px", fontWeight: "bold", maxWidth: '170px', maxHeight: '25px', minWidth: '120px', minHeight: '25px',
           marginLeft: "-15px", marginTop: "15px"}} variant="contained" color="secondary" onClick={() => props.Dispatch({ type: "POISTA_TENTTI" })}   >Poista tentti</Button>
        
        
      </div>

      

    );


}

export default Tentti1;

/*<Button style={{borderRadius: "210px", maxWidth: '130px', maxHeight: '130px', minWidth: '130px', minHeight: '130px', marginLeft: "55%", backgroundColor: "white", color: "#12a086", fontWeight: "bold"}} variant="contained"  onClick={() => Alkutilalle()}> 
          Palaa  alkutilalle
        </Button>
        */