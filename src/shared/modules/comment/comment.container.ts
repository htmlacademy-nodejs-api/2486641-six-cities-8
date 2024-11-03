import { Container } from 'inversify';
import { CommentEntity, CommentModel, CommentService } from './index.js';
import { Component } from '../../types/component.enum.js';
import { DefaultCommentService } from './default-comment.service.js';
import { types } from '@typegoose/typegoose';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<CommentService>(Component.CommentService).to(DefaultCommentService);
  commentContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);

  return commentContainer;
}
