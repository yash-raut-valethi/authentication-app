import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

interface Slide {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  currentSlide = 0;

  isProfileOpen = false;

  userName = 'User';

  userEmail = '';

  userInitial = 'U';

  private carouselInterval?: ReturnType<typeof setInterval>;

  slides: Slide[] = [
    {
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=85',
      eyebrow: 'DISCOVER • EXPLORE • EXPERIENCE',
      title: 'Beautiful moments begin here.',
      description: 'Explore inspiring places, beautiful experiences and everything that makes life memorable.'
    },
    {
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85',
      eyebrow: 'ESCAPE • DREAM • CREATE',
      title: 'Escape the ordinary.',
      description: 'Take a break from everyday life and discover something beautifully different.'
    },
    {
      image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2000&q=85',
      eyebrow: 'LIVE • INSPIRE • GROW',
      title: 'Find your inspiration.',
      description: 'A thoughtfully crafted space designed to help you discover, explore and grow.'
    }
  ];

  constructor(
    private readonly router: Router
  ) {}

  ngOnInit(): void {

    this.loadUser();

    this.startCarousel();

  }

  ngOnDestroy(): void {

    this.stopCarousel();

  }

  loadUser(): void {

    const storedUser =
      localStorage.getItem('user');

    if (!storedUser) {
      return;
    }

    try {

      const user =
        JSON.parse(storedUser);

      this.userName =
        user.name ||
        user.email ||
        'User';

      this.userEmail =
        user.email ||
        '';

      this.userInitial =
        this.userName
          .charAt(0)
          .toUpperCase();

    } catch (error) {

      console.error(
        'Unable to load user:',
        error
      );

    }

  }

  startCarousel(): void {

    this.stopCarousel();

    this.carouselInterval =
      setInterval(() => {

        this.nextSlide();

      }, 5000);

  }

  stopCarousel(): void {

    if (this.carouselInterval) {

      clearInterval(
        this.carouselInterval
      );

      this.carouselInterval =
        undefined;

    }

  }

  nextSlide(): void {

    this.currentSlide =
      (this.currentSlide + 1) %
      this.slides.length;

  }

  previousSlide(): void {

    this.currentSlide =
      (
        this.currentSlide -
        1 +
        this.slides.length
      ) %
      this.slides.length;

  }

  selectSlide(index: number): void {

    this.currentSlide = index;

    this.startCarousel();

  }

  toggleProfile(): void {

    this.isProfileOpen =
      !this.isProfileOpen;

  }

  logout(): void {

    localStorage.removeItem(
      'isLoggedIn'
    );

    localStorage.removeItem(
      'user'
    );

    this.router.navigateByUrl('/');

  }

}
