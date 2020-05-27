import { ViewChild, ElementRef, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DashboardService } from './dashboard.service';

declare const Plotly: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  footerDate: Date = new Date();
  data: any;
  searchText: any;
  visibleStates = [];
  statesKeys = {};
  covidDates = [];
  rawData: any;
  layout = {};
  selectedStates: any = ['Maharashtra'];
  @ViewChild('plotContainer') plotContainer: ElementRef;
  constructor(private dashboardSerive: DashboardService) {
    this.visibleStates = this.dashboardSerive.getVisibleStates();
    this.visibleStates.forEach(states => {
      this.statesKeys[states.key] = states.name;
    });
  }

  ngOnInit(): void {
    this.dashboardSerive.getCovidData().subscribe(res => {
      this.rawData = res;
      this.processData();
      this.setConfiguration();
    });
  }
// Process graph data
public processData(){
  this.data = [];
  let confirmedCases = [];
  let lastWeekConfirmedCases = [];
  this.rawData.forEach((d: any) => { if (d.status === 'Confirmed'){ this.covidDates.push(d.date); }});

  Object.keys(this.statesKeys).forEach((key: string) => {
    this.rawData.forEach((d: any) => {
      if (d.status === 'Confirmed'){
        confirmedCases.push(d[key]);
      }});
    confirmedCases = confirmedCases.map(Number);
    confirmedCases = confirmedCases.reduce((r, a) => { r.push((r.length && r[r.length - 1] || 0) + a); return r; }, []);
    lastWeekConfirmedCases = confirmedCases.map((e, i, a) => e - a[i - 7]);
    this.data.push({state: this.statesKeys[key], date: this.covidDates, cases: confirmedCases.map(e => e >= 5 ? e : NaN),
        m: lastWeekConfirmedCases.map((e, i) => confirmedCases[i] >= 5 ? e : NaN)});
    confirmedCases = [];
    lastWeekConfirmedCases = [];
  });
}
public formatDataForPlotting(states: string[]) {
  const graphData = [];
  let graphDate = [];
  this.data.forEach((d: any) => {
    this.covidDates.forEach((dt: string) => {
      graphDate.push(d.state + '<br>' + dt);
    });
    if (states.includes(d.state)){
    graphData.push({x: d.cases, y: d.m, name: d.state,
      text: this.covidDates.map(date => d.state + '<br>' + date),
      mode: 'lines+markers', type: 'scatter',
      textposition: 'center right',
      marker: {size: 2, color: 'rgba(254, 52, 110, 1)'},
      line: {color: '#721b65', simplify: false},
      transforms: [{
        type: 'filter',
        operation: '<=',
        target: this.covidDates,
        value: this.covidDates
      }]
    });
    graphDate = [];
    }});
  return graphData;
}
public updateGraph(): void{
  const selectedState = [];
  for (const state of this.visibleStates) {
    if (state.checked === true) {
      selectedState.push(state.name);
    }
  }
  const dataFrame = this.formatDataForPlotting(selectedState);
  Plotly.react(this.plotContainer.nativeElement, dataFrame, this.layout);
}

public onResize() {
  Plotly.Plots.resize(this.plotContainer.nativeElement);
}

public setConfiguration(): void{
  const dataFrame = this.formatDataForPlotting(this.selectedStates);
  const dateframes = [];
  for (const date of this.covidDates) {
    dateframes.push({
      name: date,
      data:  this.data.map(d => ({
        'transforms[0].value': date
      }))
    });
  }
  console.log(dateframes);
  const graphDiv = this.plotContainer.nativeElement;
  const sliderSteps = [];
  for (const date of this.covidDates) {
    sliderSteps.push({
      method: 'animate',
      label: date,
      args: [[date], {mode: 'immediate',transition: {duration: 200},frame: {duration: 200, redraw: false}
      }]
    });
  }
  this.layout = {
    height: 700,
    plot_bgcolor:'black',
    paper_bgcolor:'black',
    title:{text:'Trajectory of Indian States COVID-19 Confirmed Cases ('+this.covidDates[this.covidDates.length - 1]+')',
    font: {size: 24,color: 'white'}},
    showlegend:false,
    autorange:false,
    xaxis:{title:'Total Confirmed Cases',type:'log',range:[1,6],color:'white',titlefont:{size:24,color:'rgba(242, 59, 118,1)'}},
    yaxis:{title:'New Confirmed Cases Last Week',type:'log',range:[0,5],color:'white',titlefont:{size:24,color:'rgba(242, 59, 118,1)'}},
    hovermode:'closest',
    font:{family:'Open Sans, sans-serif',color:'black',size:14},
    updatemenus: [{x: 0,y: 0,yanchor: 'top',xanchor: 'left',showactive: false,direction: 'left',type: 'buttons',pad: {t: 90, r: 10},
    buttons: [{method: 'animate',fill: 'white',args: [null, {
          mode: 'immediate',
          fromcurrent: true,
          transition: {duration: 100},
          frame: {duration: 100, redraw: false}
        }],label: 'Play'
      }, {method: 'animate',args: [[null], {
          mode: 'immediate',
          transition: {duration: 0},
          frame: {duration: 0, redraw: false}
        },
      ], label: 'Pause'}]}],
    sliders: [{tickcolor: 'transparent',font: {color: 'transparent'},
              bordercolor: 'black',pad: {l: 130, t: 60},currentvalue: {
              visible: true,
              prefix: 'Date:',
              xanchor: 'right',
              font: {size: 20, color: 'white'}},
              steps: sliderSteps}
            ]};
  Plotly.plot(graphDiv, {
    data: dataFrame,
    layout: this.layout,
    frames: dateframes,
    config : {responsive: true}
  });
  // .then(() => {
  //   Plotly.animate(graphDiv);
  // });
}
// Sidebar related functions
onItemSelect(item: any){
  const selectedState = item.target.defaultValue;
  for (const state of this.visibleStates) {
    if (state.name === selectedState) {
    state.checked = true;
    }
  }
  this.updateGraph();
}
onSelectAll(items: any){
  for (const state of this.visibleStates) {
    state.checked = true;
  }
  this.updateGraph();
}
onDeSelectAll(items: any){
  for (const state of this.visibleStates) {
    state.checked = false;
  }
  this.updateGraph();
}

}
