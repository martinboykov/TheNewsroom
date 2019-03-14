import { HeaderService } from './../../header/header.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from './../post.model';
import { PostService } from '../post.service';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit, OnDestroy {
  postForm: FormGroup;
  loading;
  mode = 'create';
  _id: string;
  imagePreview: any;
  post: Post;
  categories: any[] = []; // the data is not strict category !?!?, but with populate subcategories name
  subcategories: any[] = []; // the data is not strict category !?!?, but with populate subcategories name
  categorieselected;
  tagsArray: any[] = [];
  private categoriesSubscription: Subscription;
  jodiConfig = {
    // defaultMode: '3',
    height: 450,
    autofocus: true,
    enter: 'DIV',
    // uploader: {
    //   insertImageAsBase64URI: true,
    // },
    defaultActionOnPaste: 'insert_only_text',
    buttons: `source,
     |,bold,strikethrough,underline,italic,
     |,superscript,subscript,align,|,outdent,indent,|,ul,ol,
     |,font,fontsize,brush,paragraph,|,table,link,
     |,undo,redo,\n,cut,hr,eraser,copyformat,
     |,symbol,selectall,print`
  };

  constructor(
    private postService: PostService,
    private headerService: HeaderService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.postForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(20), Validators.maxLength(200)]),
      categorie: new FormControl(null, [Validators.required]),
      subcategorie: new FormControl(null, []),
      tags: new FormArray([], [Validators.required, this.tagsValidator.bind(this)]),
      content: new FormControl(null, [Validators.required, Validators.minLength(200), Validators.maxLength(4000)]),
      image: new FormControl('', { validators: [Validators.required], asyncValidators: [mimeType] }),

    });

    // get mode(create/edit) and Post ID
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('_id')) {
        this.mode = 'edit';
        this._id = paramMap.get('_id');
        console.log('mode: EDIT');
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
        console.log('mode: CREATE');
        this.mode = 'create';
        this._id = null;
      }
    });
    this.headerService.getCategories();
    this.categoriesSubscription = this.headerService.getCategoriesUpdateListener()
      .subscribe((categories: any[]) => {
        console.log(categories);
        this.categories = categories;
      });
    this.postService.getTagNames()
      .subscribe((tags) => {
        this.tagsArray = [...tags];
        console.log(this.tagsArray);

      })

  }

  get title() { return this.postForm.get('title'); }
  get categorie() { return this.postForm.get('categorie'); }
  get subcategorie() { return this.postForm.get('subcategorie'); }
  get tags() { return this.postForm.get('tags') as FormArray; }
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
  get categorieErrorRequired() {
    // const activated = this.username.errors.required;
    if (this.categorie.errors) {
      // console.log(this.title.errors);
      if (this.categorie.errors.required) {
        return true;
      }
    } else {
      return null;
    }
  }
  get subcategorieErrorRequired() {
    // const activated = this.username.errors.required;
    if (this.subcategorie.errors) {
      // console.log(this.title.errors);
      if (this.subcategorie.errors.required) {
        return true;
      }
    } else {
      return null;
    }
  }
  get tagsErrorRequired() {
    if (this.tags.errors) {
      // console.log(this.content.errors);
      if (this.tags.errors.required) {
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

  onSavePost() {
    if (this.postForm.invalid) { return; }
    // const userId = this.authService.getUserId();
    if (this.mode === 'create') {
      const title = this.postForm.value.title;
      const content = this.postForm.value.content;
      const categorie = this.postForm.value.categorie;
      const subcategorie = this.postForm.value.subcategorie;
      const image = this.postForm.value.image;
      const tags = this.postForm.value.tags;
      const post = {
        title,
        content,
        categorie,
        tags,
        image
      };
      if (subcategorie) { Object.assign(post, { subcategorie }); }
      this.postService.addPost(post);
      // this.postForm.reset();
    }
    if (this.mode === 'edit') {
      // ....
    }
  }

  // Image
  // ----------------------------------
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
      console.log(this.imagePreview);

    }
    reader.readAsDataURL(file);
  }

  // Content
  // ----------------------------------
  contentHandeln(event) {
    const el: HTMLElement = event.editor.statusbar.container;
    const letterCounter =
      el.querySelector('.jodit_statusbar_item.jodit_statusbar_item-right').firstChild.textContent;
    console.log(letterCounter);

    const htmlContent = event.args[0].target.innerHTML;
    this.content.setValue(htmlContent);
    console.log(htmlContent);
  }


  // Categories
  // ----------------------------------
  onCategorieSelected() {
    this.categorieselected = this.categories.find((x) => x.name === this.categorie.value);
    console.log(this.categorieselected);
    this.subcategorie.setValue(null);
  }

  // Subcategories
  // ----------------------------------
  onSubcategorieOpen() {
    if (this.categorieselected) {
      this.subcategories = [...this.categorieselected.subcategories];
    }
  }

  // Tags
  // ----------------------------------
  onAdd(tag) {
    if (typeof tag === 'object' && tag !== null) {
      return (this.tags as FormArray).push(new FormControl(tag));
    }
    (this.tags as FormArray).push(new FormControl(tag));
  }

  onRemove(tag) {
    const index = this.tags.value.indexOf(tag.label);
    this.tags.removeAt(index);
  }

  // time laps simulator
  addTagPromise(name) {
    return new Promise((resolve) => {
      this.loading = true;
      setTimeout(() => {
        // how is the new tag added to tags array
        resolve(name);
        this.loading = false;
      }, 1000);
    });
  }

  // ng-select internal
  addTag(name) {
    // console.log(name);
    return { name: name, tag: true };
  }

  // gives entire ng-select object (for debugging etc...)
  onChange(select) {
    // console.log(select);
    // console.log(select.itemsList.selectedItems.splice(0,1));
  }

  // tags must be between 2 and 25 characters each
  tagsValidator(controls: AbstractControl[]): { [key: string]: boolean } {
    let lengthErrorIndicator = true;
    if (controls.length > 0) {
      console.log('not empty');
      controls['value'].forEach((tag) => {
        console.log(tag.length);

        if (tag.length < 2 || tag.length > 25) {

          lengthErrorIndicator = false;
        }
      });
      return lengthErrorIndicator ? null : { lengthError: true };
    } else {
      console.log('empty');
      return null;
    }
  }




  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe(); // prevent memory leaks
  }

}

