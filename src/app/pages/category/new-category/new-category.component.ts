import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../category.service';
import { Category } from '../../../category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css'],
})
export class NewCategoryComponent implements OnInit {
  constructor(private categoryservice: CategoryService,
    private router: Router) {}

  category: Category = new Category();
  submitted = false;

  ngOnInit() {
    this.submitted = false;
  }
  newCategory(): void {
    this.submitted= false;
    this.category = new Category;
  }

  save() {
    this.categoryservice.createCategory(this.category).subscribe(
      (data) => {
        console.log(data);
        this.category = new Category();
        this.goToListCategory()
    },
      (error) => console.log(error)
    );
    this.category = new Category();
  }

  goToListCategory(){
    this.router.navigate(['/category'])
  }
  onSubmit() {
    this.submitted = false;
    this.save();
  }
}
