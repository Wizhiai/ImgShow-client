import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

import { ShowService } from './show.service';
import { FileData } from './model/fileData';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css'],
  providers: [ShowService]
})

export class ShowComponent implements OnInit {
  fileSet: Set<FileData>;
  fileArr: FileData[];
  isGuest: Boolean;
  dialogRef: MatDialogRef<AddImageDialog>;

  ngOnInit(): void {
    this.fileSet = new Set<FileData>();
    this.fileArr = new Array();
    this.isGuest = (sessionStorage.getItem('guest') === 'true')
    sessionStorage.setItem('date', Date.now().toString());

    this.getList();
  }

  getList(): void {
    this.showService.getList()
      .then(files => {
        files.forEach(f => {
          this.fileSet.add(f)
        })
        this.sortData();
      })
      .catch(err => {
        console.log(Array.from(this.fileSet));
        console.error('An error', err);
        if(err._body == 'Authentication Error'){
          this.router.navigate(['/login']);
        }
      });
  }

  constructor(
    public dialog: MatDialog,
    public showService: ShowService,
    private router: Router
  ) { }

  addDialog(): void {
    this.dialogRef = this.dialog.open(AddImageDialog, {
      data: {
        title: '新增图片',
        file: '',
        file_show: true,
        fileData: new FileData()
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
      if(result){
        this.showService.add(result.file, result.fileData.file_comment, result.fileData.file_date, result.fileData.is_private)
        .then(msg => {
          if(msg.code === 200){
            this.fileSet.add(msg.data as FileData);
            this.sortData();
          }
        });
      }
    });
  }

  editDialog(fileData): void {
    this.dialogRef = this.dialog.open(AddImageDialog, {
      data: {
        title: '编辑图片',
        file: '',
        file_show: false,
        fileData: fileData
      },
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
      if(result){
        this.showService.edit(result.fileData)
        .then(msg => {
          console.log(msg)
          if(msg.code === 200){
            this.sortData();
          }
        });
      }
    });
  }

  sortData(): void {
    this.fileArr = Array.from(this.fileSet).sort((a, b) => b.file_date.getTime() - a.file_date.getTime());
    let count = this.fileArr.length;
    if(count > 0){
      sessionStorage.setItem('date', this.fileArr[count-1].file_date.toString());
    }
  }

  delete(id: number, item: FileData): void {
    let r = confirm('确定要删除信息？');
    if(r){
      this.showService.delete(id)
      .then(msg => {
        console.log(msg)
        if(msg.code === 200){
          this.fileSet.delete(item);
          this.sortData();
        }
      });
    }
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog-file.html'
})
export class AddImageDialog {
  constructor(
    public dialogRef: MatDialogRef<AddImageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onChange(event): void{
    var file = event.target.files[0];
    console.log('file:', file)
    this.data.fileData.file_date = file.lastModifiedDate;
    this.data.file = file;
  }
}
