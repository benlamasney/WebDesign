$(document).ready( function(){
    attachHandlers();
});


//creates div above flag containing title and close button
var aboveFlag = function(cardObject) {
  let af = document.createElement('div');
  af.className = 'aboveFlag';
  //Country name
  let cName = document.createElement('span');
  let cNameText = document.createTextNode(cardObject.name);
  cNameText.className = 'countryName';
  cName.appendChild(cNameText);
  af.appendChild(cName);
  //close button
  let closeButton = document.createElement('i');
  closeButton.className = 'fa fa-times';
  af.appendChild(closeButton);
  let card = document.getElementById(cardObject.alpha3Code);
  card.appendChild(af);

  $('.aboveFlag').css({'display':'flex','justify-content':'space-between',
                        'font-size': '1.2em','width':'100%'});
  $('.fa').css({'color':'gray','cursor':'pointer', 'font-size':'.8em'});
}
//create card stats table, return table object
var createTable = function( data ){
  let tableHeaders = ['Population','Native Name','Country Code', 'Calling Code','Region','Subregion','Capital City'];
  let objVals     = [ data.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), data.nativeName, data.numericCode, data.callingCodes[0], data.region, data.subregion, data.capital];
  let div = document.createElement('div');
  div.className = 'tableDiv';
  let table = document.createElement('table');
  table.className = 'cardTable';
  table.border = 'none';
  tableHeaders.forEach((header, i) => {
    let row = document.createElement('tr');
    let headerEl = document.createElement('td');
    headerEl.className = 'tableHeader';
    let text = document.createTextNode(header);
    text.className = 'tableBold';
    headerEl.appendChild(text);
    let toBeFilled = document.createElement('td');
    toBeFilled.className = 'tableData';
    text = document.createTextNode(objVals[i]);
    toBeFilled.appendChild(text);

    row.appendChild(headerEl);
    row.appendChild(toBeFilled);
    table.appendChild(row);
  });
  div.appendChild(table);
  let card = document.getElementById(data.alpha3Code);
  card.appendChild(div);
  $('.cardTable').css({'border':'none',
                      'box-shadow':'none'});
  $('.tableHeader').css({ 'margin-right':'15px'});
  $('.tableData').css({'font-weight':'lighter'});
}
function getFlag( data ){
  let countryFlag = document.createElement('img');
  countryFlag.className = 'cFlag';
  let card = document.getElementById(data.alpha3Code);
  card.appendChild(countryFlag);
  countryFlag.src = data.flag;
  countryFlag.border = "solid black 1px";
  $('.cFlag').css({'width':'100%'});
}
//document.addEventListener('DOMContentLoaded');
//create blank country card
var createCountryCard = function( data ) {
  var card = document.createElement('div');
  //display info
  card.id = data.alpha3Code;
  card.className = 'cCard';
  let container = document.getElementById('container');
  container.appendChild(card);
    //div above flag containing title and close button
  aboveFlag(data);
  //country flag
  getFlag(data);
  //Country info (table)
  createTable( data );

  //Wiki links
  createWiki( data );

  showWiki();
  //add all elements to card here to organize ordering of elements in cardTable
  $('.cCard').css({ 'background-color':'rgb(254,244,202)',
                    'border'          :'1px solid darkgray',
                    'boxShadow'       :'3px 3px 5px rgb(42,42,42)',
                    'border-radius'   :'5px',
                    'width'           :'40vw',
                    'height'          :'fit-content',
                    'position'        :'sticky',
                    'display'         :'flex',
                    'flex-direction'  :'column',
                    'min-width'       :'150px',
                    'max-width'       :'350px',
                    'margin'          :'0 10px 10px 10px',
                    'padding'         :'10px'});
  $('.cCard').attr({"countryName":data.name});
}

function createWiki( data ){
  let card = document.getElementById(data.alpha3Code);
  let wikiDiv = document.createElement('div');
  let wikiTitle = document.createElement('div');
  wikiTitle.innerHTML = 'Wikipedia Articles';
  wikiTitle.className = 'wikiTitle';
  wikiDiv.appendChild(wikiTitle);
  wikiDiv.className = 'wikiDiv';
  $.ajax({
    method: 'GET',
    url: `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&list=search&prop=links&srsearch=${data.name},sports`,
    success: function( result ){
      result.query.search.forEach( (link) => {
        let article = document.createElement('article');
        article.className = 'article';
        let header = document.createElement('header');
        header.className = 'articleHeader';
        header.innerHTML = link.title;
        article.appendChild(header);
        let p = document.createElement('p');
        p.className = 'articleSnippet';
        p.innerHTML = link.snippet;
        article.appendChild(p);
        wikiDiv.appendChild(article);
      });
    },
    error: (xhr, status, errorThrown) => {
      console.log("There was an error retrieving wikipedia data related to your" +
      "search.\nWe apologize for any inconvenience.");
    }
  });
  card.appendChild(wikiDiv);
  $('.article').css({
    'display':'flex',
    'border': 'solid gray 1px',
    'border-radius':'5px',
    'flex-direction':'column',
    'width':'100%',
    'height':'fit-content',
    'margin-top':'5px',
    'margion-bottom': '5px'
  });
  $('.articleHeader').css({
    'background-color':'rgb(228,223,213)',
    'border-bottome':'solid darkgray 1px;',
    'color':'rgb(11,0,234)',
    'height':'fit-content',
    'padding':'5px'
  });
  $('.articleSnippet').css({
    'background-color':'rgb(254,250,236)',
    'height':'fit-content',
    'padding':'15px',
    'margin':'0'
  });
  $('.wikiTitle').css({
    "font-size":"1.2em",
    "margin-top":'10px',
    "margin-bottom":'10px'
  });
}

var wikiClicked = function(){
  return document.getElementById('wiki_checkbox').checked;
  //if(checkBox
}
function showWiki(  ) {
  //let wikiDivs = document.getElementsByClass('wikiDiv');
  if(wikiClicked()){
    $('.wikiDiv').show();
      $('.wikiDiv').attr('display','block');
  }
  else{
      $('.wikiDiv').hide();
      $('.wikiDiv').attr('display','none');
  }

}
function attachHandlers(){
  var button = document.getElementById('search_button_search');
  button.addEventListener('click',searchClicked);
  var checkbox = document.getElementById('wiki_checkbox');
  checkbox = document.addEventListener('check',showWiki);
}

function searchClicked() {
  let val = document.getElementById('search_area').value;
  if(!val == ""){
    $.ajax({
      method: 'GET',
      url: `https://restcountries.eu/rest/v2/name/${val}?fields=name;alpha3Code`,
      success: function( result ){
        populateDropDown( result );
      },
      error: (xhr, status, errorThrown) => {
        alert("No data was found using the value: " + val);
        console.log("There was an error retrieving data related to your" +
        "search.\nWe apologize for any inconvenience.");
      }
    });
  } else {
    //make sure drop down and add button are not visible
    $('#dropdown_search').empty();
  }
}
//takes in object JSON object
//creates dropdown
//adds to DOM
//mades visible
function populateDropDown( listOfCountries ) {
  let dropdown = document.createElement('select');
  dropdown.id = 'country_select';
  listOfCountries.forEach( country => {
    let option = document.createElement('option');
    option.value = country.alpha3Code;
    let text = document.createTextNode(country.name);
    option.appendChild(text);
    dropdown.appendChild(option);
  });
  let span = document.getElementById('dropdown_search');
  let addButton = document.createElement('span');
  let buttonText = document.createTextNode('Add');
  addButton.appendChild(buttonText);
  addButton.id = 'add_button';
  addButton.addEventListener('click',addClicked);
  if($('#dropdown_search').attr('isvisible') == 'false'){
      span.appendChild(dropdown);
      span.appendChild(addButton);
  }
  else{
    //delete dropdown that exists
    $('#dropdown_search').empty();
    //replace with new
    span.appendChild(dropdown);
    span.appendChild(addButton);
  }
  $('#dropdown_search').attr('isvisible','true');
  $('#dropdown_search').css('visibility', 'visible');
  $('#add_button').css('height','100%');
  $('#add_button').css('background-color','lightgray');
  $('#add_button').css('font-size','.8em');
  $('#add_button').css('cursor','pointer');
  $('#add_button').css('margin-left','5px');
  $('#add_button').css('padding-right','4px');
  $('#add_button').css('padding-left','4px');
  $('#add_button').css('text-align','center');
}

//creates/adds dynamic country cards
function addClicked() {
  var cCode = $('#country_select').val();
  cCode = cCode.toLowerCase();
  $('#dropdown_search').empty();
  document.getElementById('search_area').value = '';
  $.ajax({
    method: 'GET',
    url: `https://restcountries.eu/rest/v2/alpha/${cCode}`,
    success: function( result ){
      createCountryCard( result );
    },
    error: (xhr, status, errorThrown) => {
      console.log("There was an error retrieving data related to your" +
      "search.\nWe apologize for any inconvenience.");
    }
  });
}
