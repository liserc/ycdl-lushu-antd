<template>
  <a-card :bordered="false" :body-style="{padding:'0px'}">
    <a-comment>
      <a-avatar
        slot="avatar"
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        alt="Han Solo"
      />
      <div slot="content">
        <a-form-item>
          <a-textarea v-model="value" placeholder="发表自己的看法" :rows="4"></a-textarea>
        </a-form-item>
        <a-form-item>
          <a-button
            htmlType="submit"
            :loading="submitting"
            @click="handleSubmit"
            type="primary"
          >
            评论
          </a-button>
        </a-form-item>
      </div>
    </a-comment>
    <a-list
      size="small"
      class="container"
      :header="`${data.length} 条评论`"
      itemLayout="horizontal"
      :dataSource="data"
    >
      <a-list-item slot="renderItem" slot-scope="item">
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
          <div v-for="(reply,replyIndex) in item.replies" :key="replyIndex" class="item">
            <div class="reply-content">
              <span class="from-name">{{ reply.reviewerNickName }}</span><span>: </span>
              <span class="to-name">@{{ reply.respondentNickName }}</span>
              <span>{{ reply.content }}</span>
            </div>
            <div class="reply-bottom">
              <span>{{ reply.createTime }}</span>
              <span class="reply-text" @click="showCommentInput(item, reply)">
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
                v-model="inputComment"
                class="gray-bg-input"
                type="textarea"
                :rows="3"
                autofocus
                placeholder="写下你的评论"
              />
              <div class="btn-control">
                <span class="cancel" @click="cancel">取消</span>
                <el-button class="btn" type="success" round @click="commitComment">确定</el-button>
              </div>
            </div>
          </transition>
        </div>
      </a-list-item>
    </a-list>
  </a-card>
</template>
<script>
import moment from 'moment'
export default {
  filters: {
    fromNow (date) {
      if (date) {
        return moment(date).fromNow()
      }
    }
  },
  data () {
    return {
      inputComment: '',
      showItemId: '',
      value: '',
      submitting: false,
      data: [
        {
          'id': '26',
          'routeId': '1143275648668798976',
          'routeType': 0,
          'userId': '1',
          'content': '回复张一',
          'createTime': '2019-07-06 13:43:39',
          'nickName': '张一',
          'avatar': 'http://ycdl.oss-cn-shenzhen.aliyuncs.com/lushu/users/avatars/8343bda9342c4a2aab6670beb4cebbb9.jpeg',
          'replies': []
        },
        {
          'id': '52',
          'routeId': '1143275648668798976',
          'routeType': 0,
          'userId': '10',
          'content': 'H股',
          'createTime': '2019-07-09 19:12:08',
          'nickName': '068zo9ube5',
          'avatar': 'http://ycdl.oss-cn-shenzhen.aliyuncs.com/lushu/users/avatars/8343bda9342c4a2aab6670beb4cebbb9.jpeg',
          'replies': []
        },
        {
          'id': '53',
          'routeId': '1143275648668798976',
          'routeType': 0,
          'userId': '10',
          'content': '再次回复',
          'createTime': '2019-07-09 19:23:43',
          'nickName': '068zo9ube5',
          'avatar': 'http://ycdl.oss-cn-shenzhen.aliyuncs.com/lushu/users/avatars/8343bda9342c4a2aab6670beb4cebbb9.jpeg',
          'replies': [
            {
              'id': '1',
              'commentId': '53',
              'reviewerId': '10',
              'respondentId': '1',
              'content': '回复张一',
              'createTime': '2019-07-09 20:28:14',
              'reviewerNickName': '068zo9ube5',
              'reviewerAvatar': 'http://ycdl.oss-cn-shenzhen.aliyuncs.com/lushu/users/avatars/8343bda9342c4a2aab6670beb4cebbb9.jpeg',
              'respondentNickName': '张一',
              'respondentAvatar': 'http://ycdl.oss-cn-shenzhen.aliyuncs.com/lushu/users/avatars/8343bda9342c4a2aab6670beb4cebbb9.jpeg'
            },
            {
              'id': '2',
              'commentId': '53',
              'reviewerId': '1',
              'respondentId': '10',
              'content': '你是不是傻',
              'createTime': '2019-07-09 20:48:54',
              'reviewerNickName': '张一',
              'reviewerAvatar': 'http://ycdl.oss-cn-shenzhen.aliyuncs.com/lushu/users/avatars/8343bda9342c4a2aab6670beb4cebbb9.jpeg',
              'respondentNickName': '068zo9ube5',
              'respondentAvatar': 'http://ycdl.oss-cn-shenzhen.aliyuncs.com/lushu/users/avatars/8343bda9342c4a2aab6670beb4cebbb9.jpeg'
            }
          ]
        }
      ],
      moment
    }
  },
  methods: {
    handleChange () {

    },
    handleSubmit () {
      console.log('提交')
    },

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
      console.log(this.inputComment)
    },

    /**
     * 点击评论按钮显示输入框
     * item: 当前大评论
     * reply: 当前回复的评论
     */
    showCommentInput (item, reply) {
      if (reply) {
        this.inputComment = '@' + reply.reviewerNickName + ' '
      } else {
        this.inputComment = ''
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
