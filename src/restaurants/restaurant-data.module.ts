import { Module } from '@nestjs/common';

import { RestaurantsRepository } from './restaurants.repository.js';

import { RestaurantImagesRepository } from './repositories/restaurant-images.repository.js';
import { RestaurantInformationRepository } from './repositories/restaurant-information.repository.js';
import { RestaurantFeaturesRepository } from './repositories/restaurant-features.repository.js';
import { AwardsRepository } from './repositories/awards.repository.js';
import { RestaurantAwardsRepository } from './repositories/restaurant-awards.repository.js';

@Module({
  providers: [
    RestaurantsRepository,
    RestaurantImagesRepository,
    RestaurantFeaturesRepository,
    AwardsRepository,
    RestaurantAwardsRepository,
    RestaurantInformationRepository,
  ],
  exports: [
    RestaurantsRepository,
    RestaurantImagesRepository,
    RestaurantFeaturesRepository,
    AwardsRepository,
    RestaurantAwardsRepository,
    RestaurantInformationRepository,
  ],
})
export class RestaurantDataModule {}
