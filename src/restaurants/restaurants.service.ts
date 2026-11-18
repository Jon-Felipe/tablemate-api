import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// extras
import { RestaurantsRepository } from './restaurants.repository.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';
import { UserRole } from '../users/entities/user.entity.js';
import { AwardsRepository } from './repositories/awards.repository.js';
import { RestaurantAwardsRepository } from './repositories/restaurant-awards.repository.js';
import { RestaurantFeaturesRepository } from './repositories/restaurant-features.repository.js';
import { RestaurantImagesRepository } from './repositories/restaurant-images.repository.js';
import { RestaurantInformationRepository } from './repositories/restaurant-information.repository.js';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly restaurantsRepository: RestaurantsRepository,
    private readonly restaurantImagesRepository: RestaurantImagesRepository,
    private readonly restaurantInformationRepository: RestaurantInformationRepository,
    private readonly restaurantFeaturesRepository: RestaurantFeaturesRepository,
    private readonly awardsRepository: AwardsRepository,
    private readonly restaurantAwardsRepository: RestaurantAwardsRepository,
  ) {}

  findAll() {
    return this.restaurantsRepository.findAll();
  }

  findById(id: string) {
    const restaurant = this.restaurantsRepository.findById(id);

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    const awards = this.restaurantAwardsRepository
      .findByRestaurantId(id)
      .map((restaurantAward) => ({
        ...restaurantAward,
        award: this.awardsRepository.findById(restaurantAward.awardId),
      }));

    return {
      ...restaurant,
      images: this.restaurantImagesRepository.findByRestaurantId(id),
      information: this.restaurantInformationRepository.findByRestaurantId(id),
      features: this.restaurantFeaturesRepository.findByRestaurantId(id),
      awards,
    };
  }

  create(
    createRestaurantDto: CreateRestaurantDto,
    user: { sub: string; role: string },
  ) {
    if (user.role !== UserRole.STAFF && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You are not allowed to create restaurants');
    }

    return this.restaurantsRepository.create(createRestaurantDto, user.sub);
  }

  update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
    user: { sub: string; role: string },
  ) {
    const restaurant = this.restaurantsRepository.findById(id);

    if (!restaurant)
      throw new NotFoundException(`Restaurant with ID ${id} not found`);

    if (
      user.role !== UserRole.ADMIN &&
      (user.role !== UserRole.STAFF || restaurant.ownerId !== user.sub)
    ) {
      throw new ForbiddenException(
        'You are not allowed to update this restaurant',
      );
    }

    return this.restaurantsRepository.update(id, updateRestaurantDto);
  }

  remove(id: string, user: { sub: string; role: string }): void {
    const restaurant = this.restaurantsRepository.findById(id);

    if (!restaurant)
      throw new NotFoundException(`Restaurant with ID ${id} not found`);

    if (
      user.role !== UserRole.ADMIN &&
      (user.role !== UserRole.STAFF || restaurant.ownerId !== user.sub)
    ) {
      throw new ForbiddenException(
        'You are not allowed to delete this restaurant',
      );
    }

    this.restaurantsRepository.remove(id);
  }
}
