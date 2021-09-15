import { Component, Input, OnInit } from '@angular/core';

import { VoteService } from '../../../services/vote.service';
import { VoteOption } from '../../models/voteOption.model';

@Component({
  selector: 'app-vote-option',
  templateUrl: './vote-option.component.html',
  styleUrls: ['./vote-option.component.scss']
})
export class VoteOptionComponent implements OnInit {
  // @Input() data: VoteOption = {
  //   title: '',
  //   votes: 0
  // };

  @Input() data = {
    title: '',
    votes: 0,
    imageUrl: ''
  };
  @Input() total;
  @Input() editMode = true;

  constructor(
    private voteService: VoteService
  ) { }

  ngOnInit(): void {
  }

  setStyleWidth() {
    return {
      'width': (this.total > 0) ? (this.data.votes / this.total * 100) : 0 + '%'
    }
  }

  onDelete(title: String) : void {
    console.log(title);
    this.voteService.emitToServer("Delete", title);
  }

  handleImageInput(event: EventTarget) {
    let file = (<HTMLInputElement>event).files[0];
    this.voteService.addImage(this.data.title, file)
  }
}
