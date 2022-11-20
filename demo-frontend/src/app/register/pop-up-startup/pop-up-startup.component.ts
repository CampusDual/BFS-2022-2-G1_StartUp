import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { StartupsDataSource } from 'src/app/model/datasource/startup.datasource';
import { AnyField, AnyPageFilter } from 'src/app/model/rest/filter';
import { Startup } from 'src/app/model/startup';
import { StartupService } from 'src/app/services/startup.service';

import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-up-startup',
  templateUrl: './pop-up-startup.component.html',
  styleUrls: ['./pop-up-startup.component.scss']
})
export class PopUpStartupComponent implements OnInit {

   //variable MatchBtn
   MatchBtn: boolean = true;
   BubblyButton: boolean =false;

   // INtento de match
  selectedStartup?: Startup


  dataSource: StartupsDataSource;

  list;
  public startups = [];
  fields = ['name', 'email', 'description', 'idBusinessSector', 'idStartUpState','anualInvoicing','fundationYear','idEntrepreneur'];
  selection = new SelectionModel<Startup>(true, []);

  @ViewChild('input') input: ElementRef;



  constructor(private startupService: StartupService,   private translate: TranslateService, private dialog: MatDialog) {


   }

  ngOnInit(): void {
    this.dataSource = new StartupsDataSource(this.startupService);
    const pageFilter = new AnyPageFilter(
      '',
      this.fields.map((field) => new AnyField(field)),
      0,
      6,
      'name'

    );
    this.dataSource.getStartups(pageFilter);
    this.getConsola(pageFilter);

  }

  getConsola(pageFilter : AnyPageFilter){

    this.startupService.getStartups(pageFilter).subscribe((response) =>{
      this.startups = response.data;
      console.log('>>>Startups>>>', this.startups[0].idStartupState.type);

      console.log('>>>>>>>>Data Startup',response.data)})
    }


    onclick() {
      this.MatchBtn = !this.MatchBtn;
    }

    onSelected(startup: Startup): void {
      this.selectedStartup = startup;
     console.log('>>>>>Sselec:', startup);

    }

    changeProgresValue(row: string) {
      if (row == 'Pre-Seed') {
        return 20;
      } else if (row == 'Seed') {
        return 40;
      } else if (row == 'Early Stage') {
        return 60;
      } else if (row == 'Growth Stage') {
        return 80;
      } else if (row == 'Scaleup') {
        return 90;
      } else {
        return 100;
      }
    }

  }


