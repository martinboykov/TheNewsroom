import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Post } from './../post.model';
import { PostService } from '../post.service';
// import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {
  postForm: FormGroup;
   mode = 'create';
   _id: string;
   imagePreview: any;
  public post: Post;
  jodiConfig = {
    // defaultMode: '3',
    autofocus: true,
    enter: 'DIV',
    // uploader: {
    //   insertImageAsBase64URI: true,
    // },
    defaultActionOnPaste: 'insert_only_text',
    buttons: `source,
     |,bold,strikethrough,underline,italic,
     |,superscript,subscript,|,ul,ol,|,outdent,indent,
     |,font,fontsize,brush,paragraph,|,image,table,link,
     |,align,undo,redo,\n,cut,hr,eraser,copyformat,
     |,symbol,fullsize,selectall,print`
  };

  constructor(
    private postService: PostService,
    public route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.postForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      content: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
      image: new FormControl('', [Validators.required]),
      // image: new FormControl('', { validators: [Validators.required], asyncValidators: [mimeType] }),
    });
    // get mode(create/edit) and Post ID
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('_id')) {
        this.mode = 'edit';
        this._id = paramMap.get('_id');
        // this.postService.getPost(this._id)
        //   .subscribe(
        //     (postData) => {
        //       this.post = {
        //         id: postData.post._id,
        //         title: postData.post.title,
        //         content: postData.post.content,
        //         imagePath: postData.post.imagePath,
        //         creator: postData.post.creator,
        //       }
        //       // this.postForm.setValue({
        //       //   title: postData.post.title,
        //       //   content: postData.post.content,
        //       //   imagePath: postData.post.imagePath,
        //       // });
        //       this.postForm.controls.title.setValue(postData.post.title);
        //       this.postForm.controls.content.setValue(postData.post.content);
        //       this.postForm.controls.image.setValue(postData.post.imagePath);
        //     });
      } else {
        this.mode = 'create';
        this._id = null;
      }
    });
  }

  get title() { return this.postForm.get('title'); }
  get content() { return this.postForm.get('content'); }
  get image() { return this.postForm.get('image'); }

  get titleErrorRequired() {
    // const activated = this.username.errors.required;
    if (this.title.errors) {
      // console.log(this.title.errors);
      if (this.title.errors.required) {
        return true;
      }
    } else {
      return null;
    }
  }
  get titleErrorLength() {
    // const activated = this.username.errors.required;
    if (this.title.errors) {
      // console.log(this.title.errors);
      if (this.title.errors.minlength || this.title.errors.maxlength) {
        return true;
      }
    } else {
      return null;
    }
  }
  get contentErrorRequired() {
    if (this.content.errors) {
      // console.log(this.content.errors);
      if (this.content.errors.required) {
        return true;
      }
    } else {
      return null;
    }
  }
  get contentErrorLength() {
    if (this.content.errors) {
      // console.log(this.content.errors);
      if (this.content.errors.minlength || this.content.errors.maxlength) {
        return true;
      }
    } else {
      return null;
    }
  }
  get imageErrorInvalidMeme() {
    if (this.image.errors) {
      if (this.image.errors.invalidMimeType) {
        return true;
      }
    } else {
      return null;
    }
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    // console.log(file.type);
    // const isValidType = this.fileTypeCheck(file.type); // my checker
    // if(!isValidType) console.log('not valid'); // my checker

    this.postForm.patchValue({ image: file });
    this.image.updateValueAndValidity();

    // convert image to data url
    // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
    const reader = new FileReader();
    reader.onload = () => {
      // get the img src="imagePreview"
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.postForm.invalid) return;
    // const userId = this.authService.getUserId();
    if (this.mode === 'create') {
      const title = this.postForm.value.title;
      const content = this.postForm.value.content;
      const image = this.postForm.value.image;
      const post = {
        title,
        content,
        image
      }
      this.postService.addPost(post);
      // this.postForm.reset();
    }
    if (this.mode === 'edit') {
    // ....
    }

  }

  handleEvent(event) {
    const el: HTMLElement = event.editor.statusbar.container;
    const letterCounter =
      el.querySelector('.jodit_statusbar_item.jodit_statusbar_item-right').firstChild.textContent;
    console.log(letterCounter);

    const htmlContent = event.args[0]
    // console.log(htmlContent);
  }
}

