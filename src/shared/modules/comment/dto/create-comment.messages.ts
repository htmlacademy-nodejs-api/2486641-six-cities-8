export const CreateCommentValidationMessage = {
  text: {
    minLength: 'Minimum text length must be 5',
    maxLength: 'Maximum text length must be 1024',
  },
  rating: {
    invalidFormat: 'Max decimal places can be 1',
    minValue: 'Minimum rating is 1',
    maxValue: 'Maximum rating is 5',
  },
} as const;
