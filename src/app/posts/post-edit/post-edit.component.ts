import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {

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

  constructor() { }

  ngOnInit() { }

  handleEvent(event) {
    const el: HTMLElement = event.editor.statusbar.container;
    const letterCounter =
      el.querySelector('.jodit_statusbar_item.jodit_statusbar_item-right').firstChild.textContent;
    console.log(letterCounter);

    const htmlContent = event.args[0]
    // console.log(htmlContent);
  }



}
