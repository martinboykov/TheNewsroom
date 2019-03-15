import { HeaderService } from './../../header/header.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Post } from './../post.model';
import { PostService } from '../post.service';
import { mimeType } from './mime-type.validator';
import { Subscription, from, of, timer } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit, OnDestroy {
  mode = 'create';
  _id: string;
  postForm: FormGroup;
  imagePreview: any;
  post: Post;
  categories: any[] = []; // the data is not strict category !?!?, but with populate subcategories name
  subcategories: any[] = []; // the data is not strict category !?!?, but with populate subcategories name
  categorieselected;
  contentTextOnly = '';
  tagsArray: any[] = [];
  loading: boolean;
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
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
    this.postForm = new FormGroup({
      image: new FormControl('', { validators: [Validators.required], asyncValidators: [mimeType] }),
      title: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
      content: new FormControl(null, [Validators.required, Validators.minLength(200), Validators.maxLength(10000)]),
      categorie: new FormControl(null, [Validators.required]),
      subcategorie: new FormControl(null, []),
      tags: new FormArray([], [this.tagsValidatorRequired, this.tagsValidatorLength.bind(this)]),
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
    this.headerService.getCategories();
    this.categoriesSubscription = this.headerService.getCategoriesUpdateListener()
      .subscribe((categories: any[]) => {
        this.categories = categories;
      });
    this.postService.getTagNames()
      .subscribe((tags) => {
        this.tagsArray = [...tags];
      });
  }

  get title() { return this.postForm.get('title'); }
  get categorie() { return this.postForm.get('categorie'); }
  get subcategorie() { return this.postForm.get('subcategorie'); }
  get tags() { return this.postForm.get('tags') as FormArray; }
  get content() { return this.postForm.get('content'); }
  get image() { return this.postForm.get('image'); }

  // hide code...
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
  get titleErrorLengthMin() {
    // const activated = this.username.errors.required;
    if (this.title.errors) {
      // console.log(this.title.errors);
      if (this.title.errors.minlength) {
        return true;
      }
    } else {
      return null;
    }
  }
  get titleErrorLengthMax() {
    // const activated = this.username.errors.required;
    if (this.title.errors) {
      // console.log(this.title.errors);
      if (this.title.errors.maxlength) {
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
  get contentErrorLengthMin() {
    if (this.content.errors) {
      // console.log(this.content.errors);
      if (this.content.errors.minlength) {
        return true;
      }
    } else {
      return null;
    }
  }
  get contentErrorLengthMax() {
    if (this.content.errors) {
      // console.log(this.content.errors);
      if (this.content.errors.maxlength) {
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
  get tagsErrorRequired() {
    if (this.tags.errors) {
      // console.log(this.content.errors);
      if (this.tags.errors.requiredError) {
        return true;
      }
    } else {
      return null;
    }
  }
  get tagsErrorLength() {
    if (this.tags.errors) {
      // console.log(this.content.errors);
      if (this.tags.errors.lengthError) {
        return true;
      }
    } else {
      return null;
    }
  }
  get imageErrorRequired() {
    if (this.image.errors) {
      if (this.image.errors.required) {
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
      const content = this.contentTextOnly;
      const categorie = this.postForm.value.categorie;
      const subcategorie = this.postForm.value.subcategorie;
      const image = this.postForm.value.image;
      const tags = this.postForm.value.tags;
      const post = {
        title,
        content,
        categorie,
        tags,
        image,
      };
      if (subcategorie) { Object.assign(post, { subcategorie }); }
      this.postService.addPost(post);
      this.postForm.reset();
    }
    if (this.mode === 'edit') {
      // ....
    }
  }

  // Image
  // ----------------------------------
  onImagePickerClicked() {
    return timer(5000).subscribe(() => {
      if (!this.image.value) {
        this.image.markAsTouched();
      }
    });
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

  // Content
  // ----------------------------------
  contentHandler(event) {
    this.content.markAsTouched();
    const el: HTMLElement = event.editor.statusbar.container;
    const letterCounter =
      el.querySelector('.jodit_statusbar_item.jodit_statusbar_item-right').firstChild.textContent;

    this.contentTextOnly = event.args[0].target.innerHTML;
    const htmlContent = event.args[0].target.innerText;
    this.content.setValue(htmlContent);
  }


  // Categories
  // ----------------------------------
  onCategorieSelected() {
    this.categorieselected = this.categories.find((x) => x.name === this.categorie.value);
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
  onOpen() {
    // manually mark as touched, as otherwise it doesnt get fired
    (this.tags as FormArray).markAsTouched();
  }

  // time laps simulator
  addTagPromise(name) {
    return from([name])
      .pipe(
        delay(1000),
        tap(() => this.loading = false),
      )
      .toPromise();
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

  // there must be at least one tag
  private tagsValidatorRequired(controls: AbstractControl[]): { [key: string]: boolean } {
    let requiredErrorIndicator = false;
    if (controls['value'].length === 0) {
      requiredErrorIndicator = true;
    }
    return requiredErrorIndicator ? { requiredError: true } : null;
  }
  // tags must be between 2 and 25 characters each
  private tagsValidatorLength(controls: AbstractControl[]): { [key: string]: boolean } {
    let lengthErrorIndicator = false;
    if (controls.length > 0) {
      controls['value'].forEach((tag) => {
        if (!tag) { return null; }
        if (tag.length < 2 || tag.length > 25) {
          lengthErrorIndicator = true;
        }
      });
      return lengthErrorIndicator ? { lengthError: true } : null;
    } else {
      return null;
    }
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe(); // prevent memory leaks
  }

}

