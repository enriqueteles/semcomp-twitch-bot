import { BehaviorSubject, from, Observable, pipe, Subject } from 'rxjs';
import { map, reduce, subscribeOn } from 'rxjs/operators';
import connection from 'src/connection';

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { VoteService } from '../../services/vote.service';
import { VoteOption } from '../../shared/models/voteOption.model';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {

  editMode: boolean = true;
  listeningToVotes: boolean = false;
  results: VoteOption[] = [];
  nVotes : number = 0;

  constructor(
    private voteService: VoteService
  ) {
    this.voteService.listenToServer("Add").subscribe( (change) => {
      this.onChange(change);
    })
    this.voteService.listenToServer("ListeningToVotes").subscribe( (change) => {
      this.listeningToVotes = change;
    })

    // this.voteService.listenToServer("nVotes").subscribe( (data) => {
    //   this.onVote(data);
    // })
  }

  ngOnInit(): void {
    this.voteService.getResults().subscribe( data => {
      this.results = data.results;
      this.nVotes = data.nVotes;
    })
    // this.results$.subscribe(data => {
    //   this.results = data
    // })
  }

  onChange(change) {
    this.results = change;
    let temp = 0;
    change.forEach(element => {
      temp += element.votes;
    });

    this.nVotes = temp;
  }

  // onVote(change) {
  //   this.nVotes = change;
  // }


  addOption(title: String) : void {
    const option = {};
    this.voteService.emitToServer(connection.add, option);
  }

  deleteOption(title) : void {

  }

  onReset() : void {
    this.voteService.reset().subscribe( (data) => {
      this.results = data.results;
      this.nVotes = data.nVotes;
    });
  }

}
