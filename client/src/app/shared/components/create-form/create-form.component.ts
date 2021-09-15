import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { VoteService } from '../../../services/vote.service';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent implements OnInit {

  formData : FormGroup = this.formBuilder.group({});
  submitted = false;
  @ViewChild('closeModal') closeModal: ElementRef
  errorMessage: string = null;


  constructor(
    private formBuilder: FormBuilder,
    private voteService: VoteService
  ) { }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      title: [null, [Validators.required]],
      // file: [null, [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = null;

    if (this.formData.valid) {
      console.log("hellou");
      this.voteService.emitToServer('Add', this.formData.value);
      this.closeModal.nativeElement.click()
    }

    //close
  }

  get formDataControl() {
    return this.formData.controls;
  }

}
