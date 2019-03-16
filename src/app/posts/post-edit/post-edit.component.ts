import { HeaderService } from './../../header/header.service';
import { ActivatedRoute, } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Component, OnInit, OnDestroy, Renderer2, ViewChild, AfterViewInit, AfterContentInit } from '@angular/core';
import { Post } from './../post.model';
import { PostService } from '../post.service';
import { mimeType } from './mime-type.validator';
import { Subscription, from, timer } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  @ViewChild('jodit') jodit;
  mode = 'create';
  postId: string;
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
      image: new FormControl('', {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)]),
      content: new FormControl(null, [
        Validators.required,
        this.contentValidatorLengthMin.bind(this),
        this.contentValidatorLengthMax.bind(this)]),
      category: new FormControl(null, [
        Validators.required]),
      subcategory: new FormControl(null, []),
      tags: new FormArray([], [
        this.tagsValidatorRequired,
        this.tagsValidatorLength.bind(this)]),
    });

    // get mode(create/edit) and Post ID
    this.postId = this.route.snapshot.params._id;
    if (this.postId) {
      this.mode = 'edit';
      this.postService.getPost(this.postId)
        .subscribe((postData) => {
          this.post = postData.post;
          this.postForm.controls.image.setValue(this.post.imageMainPath);
          this.postForm.controls.title.setValue(this.post.title);
          this.postForm.controls.content.setValue(this.post.content);
          this.postForm.controls.category.setValue(this.post.category.name);
          if (this.post.subcategory) {

            this.postForm.controls.subcategory.setValue(this.post.subcategory.name);
          }
          // this.postForm.controls.tags.setValue(this.post.tags);
        });
    } else {
      this.mode = 'create';
      this.postId = null;
    }
    this.headerService.getCategories();
    this.categoriesSubscription = this.headerService.getCategoriesUpdateListener()
      .subscribe((categories: any[]) => {
        this.categories = [...categories];
        // if (this.mode === 'edit') {
        //   if (this.post.subcategory) {
        //     this.subcategories = this.categories.map((categorie) => {
        //       if(categorie.name === this.post.category){
        //         return categorie.subcategories;
        //       }
        //     })
        //   }
        // }
      });
    this.postService.getTagNames()
      .subscribe((tags) => {
        this.tagsArray = [...tags];
      });

  }
  ngAfterContentInit() {
  }
  ngAfterViewInit() {
  }

  get title() { return this.postForm.get('title'); }
  get category() { return this.postForm.get('category'); }
  get subcategory() { return this.postForm.get('subcategory'); }
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
      if (this.content.errors.lengthErrorMin) {
        return true;
      }
    } else {
      return null;
    }
  }
  get contentErrorLengthMax() {
    if (this.content.errors) {
      // console.log(this.content.errors);
      if (this.content.errors.lengthErrorMax) {
        return true;
      }
    } else {
      return null;
    }
  }
  get categoryErrorRequired() {
    // const activated = this.username.errors.required;
    if (this.category.errors) {
      // console.log(this.title.errors);
      if (this.category.errors.required) {
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
      const content = this.postForm.value.content;
      const category = this.postForm.value.category;
      const subcategory = this.postForm.value.subcategory;
      const image = this.postForm.value.image;
      const tags = this.postForm.value.tags;
      let post;
      post = {
        title,
        content,
        category,
        tags,
        image,
      };
      post.subcategory = subcategory;
      if (subcategory) { post.subcategory = subcategory; }

      this.postService.editPost(post);
      console.log(post);
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
    // this.content.markAsTouched();
    // const el: HTMLElement = event.editor.statusbar.container;
    // const letterCounter =
    //   el.querySelector('.jodit_statusbar_item.jodit_statusbar_item-right').firstChild.textContent;

    // this.contentTextOnly = event.args[0].target.innerHTML;
    // const htmlContent = event.args[0].target.innerText;
    // this.content.setValue(htmlContent);
  }


  // Categories
  // ----------------------------------
  onCategorySelected() {
    this.categorieselected = this.categories.find((x) => x.name === this.category.value);
    this.subcategory.setValue(null);
  }

  // Subcategories
  // ----------------------------------
  onSubcategoryOpen() {
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

  // content length must be between 200 and 100000
  public contentValidatorLengthMin(control: AbstractControl): { [key: string]: boolean } {
    let lengthErrorIndicator = false;
    const controlHtmlContent = this.renderer.createElement('DIV');
    controlHtmlContent.innerHTML = control.value;
    let text = controlHtmlContent.innerText || controlHtmlContent.textContent;
    text = text.replace(/\s+/g, '').trim();
    console.log(text.length);
    if (text.length < 200) {
      lengthErrorIndicator = true;
    }
    return lengthErrorIndicator ? { lengthErrorMin: true } : null;
  }
  // content length must be between 200 and 100000
  public contentValidatorLengthMax(control: AbstractControl): { [key: string]: boolean } {
    let lengthErrorIndicator = false;
    const controlHtmlContent = this.renderer.createElement('DIV');
    controlHtmlContent.innerHTML = control.value;
    let text = controlHtmlContent.innerText || controlHtmlContent.textContent;
    text = text.replace(/\s+/g, '').trim();
    console.log(text.length);
    if (text.length > 10000) {
      lengthErrorIndicator = true;
    }
    return lengthErrorIndicator ? { lengthErrorMax: true } : null;
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

