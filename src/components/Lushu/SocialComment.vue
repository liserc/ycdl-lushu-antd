<!--评论模块-->
<template>
  <a-card :bordered="false" :body-style="{padding:'0px'}">
    <a-comment>
      <a-avatar
        slot="avatar"
        :src="$store.getters.avatar"
        :alt="$store.getters.nickname"
      />
      <div slot="content">
        <a-form-item>
          <a-textarea v-model="comment.content" placeholder="发表自己的看法" :rows="3"></a-textarea>
        </a-form-item>
        <a-form-item v-show="comment.content">
          <a-button
            htmlType="submit"
            @click="commitComment"
            type="primary"
          >
            评论
          </a-button>
        </a-form-item>
      </div>
    </a-comment>
    <div class="container">
      <div v-for="(item,index) in comments" :key="index" class="comment">
        <div class="info">
          <img class="avatar" :src="item.avatar" width="36" height="36">
          <div class="right">
            <div class="name">{{ item.nickName }}</div>
            <div class="date">{{ item.createTime }}</div>
          </div>
        </div>
        <div class="content">{{ item.content }}</div>
        <div class="control">
          <span class="comment-reply" @click="showCommentInput(item)">
            <i class="iconfont icon-comment"/>
            <span>回复</span>
          </span>
        </div>
        <div class="reply">
          <div v-for="(replyItem,replyIndex) in item.replies" :key="replyIndex" class="item">
            <div class="reply-content">
              <span class="from-name">{{ replyItem.reviewerNickName }}</span><span>: </span>
              <span class="to-name">@{{ replyItem.respondentNickName }}</span>
              <span>{{ replyItem.content }}</span>
            </div>
            <div class="reply-bottom">
              <span>{{ replyItem.createTime }}</span>
              <span class="reply-text" @click="showCommentInput(item, replyItem)">
                <i class="iconfont icon-comment"/>
                <span>回复</span>
              </span>
            </div>
          </div>
          <div v-if="item.replies.length > 0" class="write-reply" @click="showCommentInput(item)">
            <i class="el-icon-edit"/>
            <span class="add-comment">添加新评论</span>
          </div>
          <transition name="fade">
            <div v-if="showItemId === item.id" class="input-wrapper">
              <el-input
                v-model="reply.content"
                class="gray-bg-input"
                type="textarea"
                :rows="3"
                autofocus
                placeholder="写下你的评论"
              />
              <div class="btn-control">
                <span class="cancel" @click="cancel">取消</span>
                <el-button class="btn" type="success" @click="commitReply">确定</el-button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import Vue from 'vue'
import { Input, Button } from 'element-ui'
import { postComment, postCommentReply } from '@/api/lushu/common'
Vue.use(Input)
Vue.use(Button)
export default {
  components: {},
  props: {
    commentSubject: {
      type: Object,
      required: true
    },
    comments: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      showItemId: '',
      comment: {
        content: '',
        routeId: '',
        routeType: '',
        userId: ''
      },
      reply: {
        commentId: '',
        reviewerId: '',
        respondentId: '',
        content: ''
      }
    }
  },
  computed: {},
  created () {
    this.comment = this.commentSubject
    const { userId } = this.commentSubject
    this.reply.reviewerId = userId
  },
  methods: {
    /**
       * 点击取消按钮
       */
    cancel () {
      this.showItemId = ''
    },

    /**
       * 提交评论
       */
    commitComment () {
      postComment(this.comment).then(() => {
        this.$notification['success']({
          message: '提示',
          description: '评论成功',
          duration: 8
        })
        this.comment.content = null
        this.$emit('refreshComment')
      })
    },

    /**
       * 提交回复
       */
    commitReply () {
      const { content } = this.reply
      if (content) {
        this.reply.content = content.substring(content.indexOf('：') + 1, content.length)
      }
      postCommentReply(this.reply).then(() => {
        this.$notification['success']({
          message: '提示',
          description: '回复成功',
          duration: 8
        })
        this.reply.content = ''
        this.cancel()
        this.$emit('refreshComment')
      })
    },

    /**
       * 点击评论按钮显示输入框
       * item: 当前大评论
       * reply: 当前回复的评论
       */
    showCommentInput (item, reply) {
      if (reply) {
        this.reply.content = '@' + reply.reviewerNickName + '：'
        this.reply.respondentId = reply.reviewerId
        this.reply.commentId = item.id
      } else {
        this.reply.content = ''
        this.reply.respondentId = item.userId
      }
      this.showItemId = item.id
    }
  }
}
</script>

<style scoped lang="less">
  @import "./SocialComment.less";

  .container {
    padding: 0 10px;
    box-sizing: border-box;

    .comment {
      display: flex;
      flex-direction: column;
      padding: 10px;
      border-bottom: 1px solid @border-fourth;

      .info {
        display: flex;
        align-items: center;

        .avatar {
          border-radius: 50%;
        }

        .right {
          display: flex;
          flex-direction: column;
          margin-left: 10px;

          .name {
            font-size: 16px;
            color: @text-main;
            margin-bottom: 5px;
            font-weight: 500;
          }

          .date {
            font-size: 12px;
            color: @text-minor;
          }
        }
      }

      .content {
        font-size: 16px;
        color: @text-main;
        line-height: 20px;
        padding: 10px 0;
      }

      .control {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: @text-minor;

        .like {
          display: flex;
          align-items: center;
          margin-right: 20px;
          cursor: pointer;

          &.active, &:hover {
            color: @color-main;
          }

          .iconfont {
            font-size: 14px;
            margin-right: 5px;
          }
        }

        .comment-reply {
          display: flex;
          align-items: center;
          cursor: pointer;

          &:hover {
            color: @text-333;
          }

          .iconfont {
            font-size: 16px;
            margin-right: 5px;
          }
        }

      }

      .reply {
        margin: 10px 0;
        border-left: 2px solid @border-first;

        .item {
          margin: 0 10px;
          padding: 10px 0;
          border-bottom: 1px dashed @border-third;

          .reply-content {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: @text-main;

            .from-name {
              color: @color-main;
            }

            .to-name {
              color: @color-main;
              margin-left: 5px;
              margin-right: 5px;
            }
          }

          .reply-bottom {
            display: flex;
            align-items: center;
            margin-top: 6px;
            font-size: 12px;
            color: @text-minor;

            .reply-text {
              display: flex;
              align-items: center;
              margin-left: 10px;
              cursor: pointer;

              &:hover {
                color: @text-333;
              }

              .icon-comment {
                margin-right: 5px;
              }
            }
          }
        }

        .write-reply {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: @text-minor;
          padding: 10px;
          cursor: pointer;

          &:hover {
            color: @text-main;
          }

          .el-icon-edit {
            margin-right: 5px;
          }
        }

        .fade-enter-active, fade-leave-active {
          transition: opacity 0.5s;
        }

        .fade-enter, .fade-leave-to {
          opacity: 0;
        }

        .input-wrapper {
          padding: 10px;

          .gray-bg-input, .el-input__inner {
            /*background-color: #67C23A;*/
          }

          .btn-control {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-top: 10px;

            .cancel {
              font-size: 16px;
              color: @text-normal;
              margin-right: 20px;
              cursor: pointer;

              &:hover {
                color: @text-333;
              }
            }

            .confirm {
              font-size: 16px;
            }
          }
        }
      }
    }
  }
</style>
