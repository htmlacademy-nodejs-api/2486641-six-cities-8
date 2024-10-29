export const CreateUpdateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  postDate: {
    invalidFormat: 'postDate must be a valid ISO date',
  },
  images: {
    count: 'Count of images must be 6',
  },
  rating: {
    invalidFormat: 'Max decimal places can be 1',
    minValue: 'Minimum rating is 1',
    maxValue: 'Maximum rating is 5',
  },
  type: {
    invalid: 'type must be one of apartment, house, room, hotel',
  },
  roomsCount: {
    invalidFormat: 'Count must be an integer',
    minValue: 'Minimum rooms count is 1',
    maxValue: 'Maximum rooms count is 8',
  },
  guestsCount: {
    invalidFormat: 'Count must be an integer',
    minValue: 'Minimum guests count is 1',
    maxValue: 'Maximum guests count is 10',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
  goods: {
    invalid: 'Good must be one of Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels, Fridge',
    unique: 'Goods must be unique',
    minValue: 'Minimum goods count is 1'
  }
} as const;
