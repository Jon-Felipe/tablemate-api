import { Injectable } from '@nestjs/common';
import type { Award } from '../entities/award.entity.js';

@Injectable()
export class AwardsRepository {
  private readonly awards: Award[] = [
    {
      id: 'award-1',
      name: 'Best Fine Dining',
      description: 'Recognises exceptional cuisine and service.',
      icon: 'trophy',
    },
    {
      id: 'award-2',
      name: 'Farm-to-Table Excellence',
      description: 'Celebrates restaurants using locally sourced ingredients.',
      icon: 'leaf',
    },
    {
      id: 'award-3',
      name: "Diner's Choice",
      description: 'Awarded based on outstanding guest reviews.',
      icon: 'star',
    },
  ];

  findById(id: string): Award | undefined {
    const award = this.awards.find((award) => award.id === id);
    return award ? { ...award } : undefined;
  }
}
