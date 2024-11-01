import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableModule } from '@angular/material/table';

//* Interface imports
import { PlaylistResponse } from '@/app/interfaces/playlist-response';
import { Track } from '@/app/interfaces/track';

//* Service imports
import { CurrentTrackService } from '@/app/services/current-track.service';

//* Component imports
import { PlaylistDetailsStoreService } from '@/app/services/stores/playlist-details-store.service';
import { ProgressSpinnerComponent } from "@/app/components/_shared/progress-spinner/progress-spinner.component";
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-playlist-display',
  standalone: true,
  imports: [MatTableModule, ProgressSpinnerComponent, NgFor, NgIf],
  templateUrl: './playlist-display.component.html',
  styleUrls: ['./playlist-display.component.css']
})

export class PlaylistDisplayComponent implements OnInit, OnDestroy {
  private _playlistDetails: PlaylistResponse | null | undefined = null;

  tracks: any | null | undefined = null;

  displayedColumns: string[] = ['track_number', 'title', 'artist', 'duration', 'options'];

  isLoading: boolean = false;

  private loadingSubscription: Subscription | null = null;

  constructor(private playlistDetailsStoreService: PlaylistDetailsStoreService, private currentTrackService: CurrentTrackService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.playlistDetailsStoreService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe();
  }

  @Input()
  set playlistDetails(value: PlaylistResponse | null | undefined) {
    this._playlistDetails = value;
    if (value !== null) {
      this.tracks = value?.tracks?.items ?? [];
    }
  }

  get playlistDetails(): PlaylistResponse | null | undefined {
    return this._playlistDetails;
  }

  //! Function to format tracks duration as MM:SS
  durationFormatter(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  //! Function to handle track click
  onTrackClick(track: Track): void {
    this.currentTrackService.selectTrack(track);
  }
}