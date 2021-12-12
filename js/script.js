
const xLables = [];
const yTemps = [];





 function chartIt(){
        
     const  ctx = document.getElementById('chart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: xLables,
                datasets: [{
                    label: 'Corona Statistics countries',
                    data: yTemps,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        while(xLables.length > 0) {
                xLables.pop();
             }

    }

/////////////////////////////////////////////////////////////////////////////////////////////

// function removeData(chart) {
//     chart.data.labels.pop();
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.pop();
//     });
//     chart.update();
// }

////////////////////////////////////////////////////////////////////////////////////////////

       document.querySelector(".europe").addEventListener('click',()=>{
              filterByRegion("Europe");
       })

       document.querySelector(".americas").addEventListener('click',()=>{
           filterByRegion("Americas");
       })

        document.querySelector(".africa").addEventListener('click',()=>{
            filterByRegion("Africa");
        })

        document.querySelector(".oceania").addEventListener('click',()=>{
            filterByRegion("Oceania");
        })

        document.querySelector(".asia").addEventListener('click',()=>{
            filterByRegion("Asia");
           
        })

        document.querySelector(".all").addEventListener('click',()=>{
            ShowCountriesData(false)
         
            
        
            
           
        })
  

    
       document.querySelector(".textSearch").addEventListener('keyup',()=>{
          searchFunction();
       })
///////////////////////////////////////////////////////////////////////////////////////////

        const getAllCoronaData = async () => {
            const request = await fetch("https://corona-api.com/countries")
            const data = await request.json();
            return data;
        };

///////////////////////////////////////////////////////////////

        const getCountries = async () => {
                const request = await fetch("https://restcountries.herokuapp.com/api/v1");
                const data = await request.json();
                return data;
                
        }

///////////////////////////////////////////////////////////////

    
        getAllCoronaData().then(result =>{
            
            

            getCountries().then(countries=>{

               

                    allCountriesData(result.data,countries)
                    ShowCountriesData(false)
                    chartIt();
            
            })
       
        })
 //////////////////////////////////////////////////////////////////////////       

        function  allCountriesData(coronaData, countries){

           let selectedCountery;
           let completeDataObject = [];

           coronaData.forEach(coronaElement => {
                 selectedCountery = countries.find(country =>  country.cca2 === coronaElement.code );
                 coronaElement.region = selectedCountery.region
                 completeDataObject.push(coronaElement)
           });
          
        

           localStorage.setItem("completeDataObject", JSON.stringify(completeDataObject));
          
        }
       
        
 ////////////////////////////////////////////////////////////////       
        
        
       async function ShowCountriesData(flag){
            
            
            

            let selectedCountery 
            let completeDataObject =[];
            let i = 0;
            let allData = `<tr class="header">
                            <th>#</th>
                            <th>Region</th>
                            <th>Country</th>
                            <th>Confirmed</th>
                            <th>Deaths</th>
                            <th>Recovered</th>
                            <th>Critical</th>
                            <th>Code</th>
                          </tr>  ` 

            coronaData = document.querySelector("#coronaTable")
            coronaData.innerHTML = '';

            if(flag){
                DataObject = JSON.parse(localStorage.getItem("filterdCountries") || "[]");
            }else{
                DataObject = JSON.parse(localStorage.getItem("completeDataObject") || "[]");
            } 
          
           
            DataObject.forEach((countryData => {
                   
               console.log(countryData)

                  xLables.push(countryData.name)
                  yTemps.push(countryData.latest_data.confirmed)
                  
                  

                  allData += `
                            <tr class="${countryData.code}">
                                <td>${i++}</td>
                                <td>${countryData.region}</td>
                                <td>${countryData.name}</td>
                                <td>${countryData.latest_data.confirmed}</td>
                                <td>${countryData.latest_data.deaths}</td>
                                <td>${countryData.latest_data.recovered}</td>
                                <td>${countryData.latest_data.critical}</td>
                                <td>${countryData.code}</td>
                                
                            </tr>

                          `
             }))     
           
             coronaData.innerHTML += allData;
           
            
        }

//////////////////////////////////////////////////////////////////////

function filterByRegion(region){
        let  completeDataObject1 = JSON.parse(localStorage.getItem("completeDataObject") || "[]");
             
        let filterdCountries = completeDataObject1.filter( (country) => {
          
               return country.region == region

        });

        localStorage.setItem("filterdCountries", JSON.stringify(filterdCountries));
        ShowCountriesData(true)
       
        
       
        
        
        
}

////////////////////////////////////////////////////////////////////////
        
    
function searchFunction() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.querySelector(".textSearch");
  filter = input.value.toUpperCase();
  table = document.getElementById("coronaTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}
