import { Component, OnInit } from '@angular/core';
import { BTableColumn } from '../../projects/ng-bootstrap-table/src/lib/models/table-columns.interface';
import { HttpClient } from '@angular/common/http';
import { PaginatorConfig, Sizing, Alignment } from 'projects/ng-bootstrap-table/src/lib/models/paginator.model';
// import { PaginatorConfig, Sizing, Alignment } from 'projects/ng-bootstrap-table/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showDetails: string;
  constructor(private http:HttpClient){}
  selectedRow:any;
  pConfig:PaginatorConfig;
  
  title = '10 Countries with the most cases of COVID-19';
  columns:BTableColumn[]=[
    {header:'Country',field:'Country'},
    // {header:'Country Code',field: 'CountryCode'},
    // {header:'New Confirmed',field: 'NewConfirmed'},
    {header:'Total Confirmed Cases', field: 'TotalConfirmed'},
    // {header:'New Deaths', field: 'NewDeaths'},
    // {header:'Total Deaths', field: 'TotalDeaths'},
    // {header:'New Recovered', field: 'NewRecovered'},
    // {header:'Total Recovered', field: 'TotalRecovered'}
  ];

  data:any[];
  _data:any[];
  rows:number=10;
  activePage:number = 1;

  tableClasses='table table-striped table-hover table-bordered';
  theadClasses='';
  
  ngOnInit(){
    this.pConfig= new PaginatorConfig();
    this.pConfig.sizing = Sizing.SMALL;
    this.pConfig.alignment= Alignment.RIGHT;

    this.http.get('https://api.covid19api.com/summary')
    .subscribe((users:any)=>{
      let usersCountries = users.Countries;
        function getTopN(arr: any[], prop: string, n: number) {
          var clone = arr.slice(0);
          // sort descending
          clone.sort(function(x, y) {
              if (x[prop] == y[prop]) return 0;
              else if (parseInt(x[prop]) < parseInt(y[prop])) return 1;
              else return -1;
          });
          return clone.slice(0, n);
      }
      let n = 10;
      let topCountries = getTopN(usersCountries, "TotalConfirmed", n);
      this._data=topCountries;
      this.data=topCountries;
    });
  }

  onRowSelect(event){
    let NewConfirmed: number = +event.data.NewConfirmed;
    let NewDeaths: number = +event.data.NewDeaths;
    let TotalDeaths: number = +event.data.TotalDeaths;
    let NewRecovered: number = +event.data.NewRecovered;
    let TotalRecovered: number = +event.data.TotalRecovered;

    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    this.showDetails = event.data.Country + ' has ' + numberWithCommas(NewConfirmed) + ' newly confirmed cases with ' + numberWithCommas(NewDeaths) + ' new deaths, ' + numberWithCommas(TotalDeaths) + ' total deaths, ' + numberWithCommas(NewRecovered) + ' newly recovered, and ' + numberWithCommas(TotalRecovered) + ' total recovered. ';
  }

}
