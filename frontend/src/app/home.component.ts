import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  ProfileService,
  ProfileResponse
} from './services/profile.service';

interface Slide {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
}

interface ProfileField {
  label: string;
  value: string;
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

  isProfileModalOpen = false;

  isProfileLoading = false;

  profileError = '';

  profileDetails: ProfileResponse | null = null;

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
    private readonly router: Router,
    private readonly profileService: ProfileService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.startCarousel();
  }

  ngOnDestroy(): void {
    this.stopCarousel();
  }

  get profileInitial(): string {
    const profile = this.profileDetails as
      | (ProfileResponse & {
      name?: string;
      email?: string;
    })
      | null;

    const name =
      profile?.name ||
      profile?.email ||
      this.userName ||
      'U';

    return name.charAt(0).toUpperCase();
  }

  get profileFields(): ProfileField[] {
    if (!this.profileDetails) {
      return [];
    }

    const profile =
      this.profileDetails as Record<string, unknown>;

    return Object.entries(profile)
      .filter(
        ([, value]) =>
          value !== null &&
          value !== undefined &&
          typeof value !== 'object'
      )
      .map(([key, value]) => ({
        label: key
          .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
          .replace(/^./, char => char.toUpperCase()),
        value: String(value)
      }));
  }

  loadUser(): void {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      this.userName =
        user.name ||
        user.email ||
        'User';

      this.userEmail =
        user.email ||
        '';

      this.userInitial =
        this.userName.charAt(0).toUpperCase();

    } catch (error) {
      console.error(
        'Unable to load user:',
        error
      );
    }
  }

  viewProfile(): void {
    // Open the modal immediately.
    this.isProfileOpen = false;
    this.isProfileModalOpen = true;
    this.isProfileLoading = true;
    this.profileError = '';

    this.cdr.detectChanges();

    this.profileService.getUserDetails().subscribe({

      next: (response: ProfileResponse) => {
        this.profileDetails = response;
        this.isProfileLoading = false;

        const profile =
          response as Record<string, unknown>;

        this.userName = String(
          profile['name'] ||
          profile['email'] ||
          'User'
        );

        this.userEmail = String(
          profile['email'] || ''
        );

        this.userInitial =
          this.userName.charAt(0).toUpperCase();

        // Immediately render the received profile.
        this.cdr.detectChanges();
      },

      error: (error: HttpErrorResponse) => {
        console.error(
          'Unable to load profile:',
          error
        );

        this.isProfileLoading = false;

        this.profileError =
          error.status === 401 || error.status === 403
            ? 'You are not authorized to view this profile. Please sign in again.'
            : 'Unable to load your profile. Please try again.';

        this.cdr.detectChanges();
      }

    });
  }

  closeProfile(): void {
    this.isProfileModalOpen = false;
  }

  startCarousel(): void {
    this.stopCarousel();

    this.carouselInterval = setInterval(() => {
      this.nextSlide();
      this.cdr.detectChanges();
    }, 5000);
  }

  stopCarousel(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = undefined;
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
    this.cdr.detectChanges();
  }

  toggleProfile(): void {
    this.isProfileOpen = !this.isProfileOpen;
    this.cdr.detectChanges();
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');

    this.router.navigateByUrl('/');
  }
}
