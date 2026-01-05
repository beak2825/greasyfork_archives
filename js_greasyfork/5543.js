// ==UserScript==
// @name           ello-ja
// @namespace      https://ello.co
// @include        https://ello.co/*
// @version        0.6
// @description    Unofficial Japanese localisation of Ello.
// @description:ja Ello を日本語化するスクリプトです（非公式）
// @license     Creative Commons Attribution 4.0 International Public License; http://creativecommons.org/licenses/by/4.0/
// @downloadURL https://update.greasyfork.org/scripts/5543/ello-ja.user.js
// @updateURL https://update.greasyfork.org/scripts/5543/ello-ja.meta.js
// ==/UserScript==

var L = {};

L.invitations = function () {
  var doc = document;
  var header_title        = doc.querySelector(".invitation__header h1");
  var header_descriptions = doc.querySelectorAll(".invitation__header p");
  var accepted_texts      = doc.querySelectorAll("#invitations h2.heading");


  // Invite your friends
  header_title.setTooltipAndText(
    "Invite your friends",
    "友達を招待しよう"
  );

  // Ello is invitation-only.
  header_descriptions[0].setTooltipAndText(
    "Ello is invitation-only.",
    "Ello は招待制の SNS です。"
  );

  // Use the buttons below to invite your friends. You may also send a friend an invite code manually and they can sign up at ello.co/join.
  header_descriptions[1].childNodes[0].nodeValue = "下のボタンから友達に招待メールを送りましょう。もしくは招待コードをコピーして ";
  header_descriptions[1].childNodes[2].nodeValue = " から直接登録することもできます。";
  header_descriptions[1].setTooltip("Use the buttons below to invite your friends. You may also send a friend an invite code manually and they can sign up at ello.co/join.");

  // doc.querySelector(".js-hidden-moreinvites").childNodes[0].nodeValue = "どうやら招待コードを使いきったようです。";
  // doc.querySelector(".js-hidden-moreinvites").setTooltip("Looks like you're out of invites.")

  for (var i = accepted_texts.length; i--;) {
    accepted_texts[i].childNodes[1].nodeValue = " が招待を承認しました。";
    accepted_texts[i].setTooltip(" accepted your invitation.");
  }

};

L.search = function () {
  var searchbar_field = document.getElementsByClassName("searchbar__field")[0];
  searchbar_field.setAttribute("placeholder", "ユーザを検索する");
  searchbar_field.setAttribute("title", "Search");
}

L.settings = function () {

  var doc = document;
  var titles       = doc.querySelectorAll("h2.heading--normal");
  var items        = doc.querySelectorAll(".preference__legend span:nth-child(1)");
  var descriptions = doc.querySelectorAll(".preference__legend span:nth-child(2)");

  // Profile
  titles[0].setTooltipAndText("Profile", "プロフィール");

  // Your username, name, bio and links appear on your public Ello profile. Your email address remains private.
  doc.querySelector(".credentials__form p").setTooltipAndText(
    "Your username, name, bio and links appear on your public Ello profile. Your email address remains private.",
    "ユーザ名、名前、自己紹介、リンクはあなたのプロフィールページで公開されます。メールアドレスは公開されません。"
  );

  doc.querySelector(".asset__error-msg").setTooltipAndText(
    "There was an error saving your avatar, please try again.",
    "アバター画像の保存に失敗しました。再度アバター画像をアップロードしてください。"
  );

  doc.querySelector("label.string.required.form__label").setTooltipAndText("Username", "ユーザ名");
  doc.querySelector("label.email.required.form__label").setTooltipAndText("Email", "メールアドレス");
  doc.querySelector("label.password.required.form__label").setTooltipAndText("Password", "パスワード");
  doc.querySelectorAll(".password label")[1].setTooltipAndText("Current Password", "現在のパスワード");

  doc.querySelectorAll("fieldset.form__fieldset p")[0].setTooltipAndText(
    "Re-enter your Ello password (8+ characters) to save changes to your account.",
    "変更を保存するため、現在のパスワード（8 文字以上）を入力してください。"
  );

  doc.getElementById("user_current_password").setAttribute("placeholder", "現在のパスワード *");
//  doc.querySelector(".form__feedback").setTooltipAndText("Current password is invalid", "現在のパスワードが正しくありません");

  doc.querySelector("label.string.optional.form__label").setTooltipAndText("Name", "名前");
  doc.querySelector("label.text.optional.form__label").setTooltipAndText("Bio", "自己紹介");
  doc.getElementById("user_unsanitized_short_bio").setAttribute("placeholder", "（最大 192 文字まで）");
  doc.querySelectorAll("label.string.optional.form__label")[1].setTooltipAndText("Links", "リンク");

  doc.querySelector("p.profile__flash-message").setTooltipAndText("Your settings have been saved", "プロフィールを保存しました");
  doc.querySelector("fieldset.form__fieldset a").setTooltipAndText("View Profile", "プロフィールを見る");


  doc.querySelector(".bio__counter").style.left = "3.5rem";

  // Settings
  titles[1].setTooltipAndText("Settings", "設定");

  items[0].setTooltipAndText("Public Profile", "プロフィールを Ello の外部に公開");
  // Make your profile viewable to people outside of the Ello network.
  descriptions[0].setTooltipAndText(
    "Make your profile viewable to people outside of the Ello network.",
    "Ello に登録していない人たちもあなたのプロフィールを閲覧できるようにします。"
  );

  items[1].setTooltipAndText("Comments", "コメントの許可");
  // Allow other users to comment on your posts.
  descriptions[1].setTooltipAndText(
    "Allow other users to comment on your posts.",
    "他のユーザがあなたの投稿にコメントをつけることを許可します。"
  );

  items[2].setTooltipAndText("Sharing", "共有ボタンの設置");
  // Allow other users to share your posts.
  descriptions[2].setTooltipAndText(
    "Allow other users to share your posts.",
    "あなたの各投稿のフッタに他 SNS への共有ボタンを設置します。"
  );

  items[3].setTooltipAndText("Reposting", "リポストの許可");
  // Allow other users to repost your posts.
  descriptions[3].setTooltipAndText(
    "Allow other users to repost your posts.",
    "他のユーザがあなたの投稿をリポストすることを許可します。"
  );

  items[4].setTooltipAndText("Analytics", "情報収集の許可");
  // Allow Ello to gather anonymous information about your visit, which helps us make Ello better. <a href="/wtf/post/information-use">Learn more</a>.
  descriptions[4].setTooltipAndText(
    "Allow Ello to gather anonymous information about your visit, which helps us make Ello better.",
    "Ello の質を向上させるため、Ello があなたの訪問に関する匿名の情報を収集することを許可します。"
  );

  items[5].setTooltipAndText("Embedded Media", "メディアの埋め込み");
  // Hide third party media files (YouTube, Vimeo, Soundcloud, etc.) that may contain advertising.
  descriptions[5].setTooltipAndText(
    "Hide third party media files (YouTube, Vimeo, Soundcloud, etc.) that may contain advertising.",
    "YouTube、Vimeo、Soundcloud など、広告を含む可能性があるサードパーティのメディアを非表示にします。"
  );

  // Notifications
  titles[2].setTooltipAndText("Notifications", "通知");

  items[6].setTooltipAndText("Comments", "コメント");
  descriptions[6].setTooltipAndText(
    "Receive an e-mail when other users comment on your posts.",
    "他のユーザがあなたの投稿にコメントをつけたことを知らせるメールを受信します。"
  );

  items[7].setTooltipAndText("Mentions", "メンション");
  descriptions[7].setTooltipAndText(
    "Receive an e-mail when other users mention you in a post.",
    "他のユーザがあなたについて @ で言及したことを知らせるメールを受信します。"
  );

  items[8].setTooltipAndText("New Followers", "新規フォロワー");
  descriptions[8].setTooltipAndText(
    "Receive an e-mail when other users follow you.",
    "他のユーザがあなたをフォローし始めたことを知らせるメールを受信します。。"
  );

  items[9].setTooltipAndText("Invitations", "招待の受け入れ");
  descriptions[9].setTooltipAndText(
    "Receive an e-mail when other users accept your invitations.",
    "他のユーザがあなたの招待を受け入れたことを知らせるメールを受信します。"
  );

  items[10].setTooltipAndText("Updates & Announcements", "Ello からのお知らせ");
  descriptions[10].setTooltipAndText(
    "Receive e-mails from Ello with service updates and feature announcements",
    "Ello のアップデートの告知や Ello の機能を紹介するメールを受信します。"
  );

  titles[3].setTooltipAndText("NSFW", "NSFW（職場閲覧不適切・成人向け）コンテンツ");
  items[11].setTooltipAndText("Post Adult-oriented Content", "成人向けコンテンツの投稿");
  descriptions[11].childNodes[0].nodeValue = "私は成人向けコンテンツの投稿を行います ";
  descriptions[11].setTooltip("I wish to post adult-oriented content");
  items[12].setTooltipAndText("View Adult-oriented Content", "成人向けコンテンツの閲覧");
  descriptions[12].childNodes[0].nodeValue = "私は成人向けコンテンツの閲覧を希望します ";
  descriptions[12].setTooltip("I wish to view adult-oriented content");


  // Account Deletion
  titles[4].setTooltipAndText("Account Deletion", "アカウントの削除");
  // By deleting your account you remove your personal information from Ello. Your account cannot be restored.
  items[13].setTooltipAndText(
    "By deleting your account you remove your personal information from Ello. Your account cannot be restored.",
    "Ello アカウントを削除すると、あなたの個人情報は Ello から取り除かれます。削除されたアカウントの復元はできません。"
  );

};



function localiseReservedPages() {
//  console.log(window.location.href);
  var reservedSlug = {
    "beta-public-profiles"  : function(){ console.log(self); },
    "request-an-invitation" : function(){ console.log(self); },
    "manifesto"             : function(){ console.log(self); },
    "who-made-this"         : function(){ console.log(self); },
    "wtf"                   : function(){ console.log(self); },
    "search"                : function(){ L.search(); },
    "invitations"           : function(){ L.invitations(); },
    "settings"              : function(){ L.settings(); },
    "friends"               : function(){ console.log(self); },
    "noise"                 : function(){ console.log(self); },
    "facemaker"             : function(){ console.log(self); },
    "enter"                 : function(){ console.log(self); },
    "forgot-my-password"    : function(){ console.log(self); },
    "join"                  : function(){ console.log(self); }
   };

   var current_page = reservedSlug[window.location.href.split("/")[3]];

   if (current_page !== undefined) {
      current_page.call();
  }
}

function localiseGeneralElements() {
  var doc = document;
  var deleting_text = doc.querySelectorAll(".delete__dialog p")[0];

  doc.querySelector(".ismuted").setTooltipAndText("Unmute", "ミュート解除");
  doc.querySelector(".notmuted").setTooltipAndText("Mute", "ミュート");
  doc.querySelectorAll(".block-user__column p")[0].setTooltipAndText(
    "Muting prevents further email notifications from a user and removes their past activity from your feed. The user is still able to follow you and can still comment on your posts, but you will not receive any notifications.",
    "このユーザをミュートすると、あなたのフィード上からこのユーザのアクティビティが取り除かれます。また、このユーザ関連のメール通知も Ello から送られなくなります。このユーザはあなたをフォローし続けることもあなたの投稿にコメントをつけることもできますが、それらはあなたに一切通知されません。"
  );

  doc.querySelector(".isblocked").setTooltipAndText("Unblock", "ブロック解除");
  doc.querySelector(".notblocked").setTooltipAndText("Block", "ブロック");
  doc.querySelectorAll(".block-user__column p")[1].setTooltipAndText(
    "Blocking mutes a user, and disables them from viewing your profile and posts. When blocking, we recommend setting your account to \"Non-Public\" to disable your profile from being viewed by people outside of the Ello network.",
    "このユーザをブロックすると、このユーザはあなたのフィード上やメール通知からミュートされます。それに加え、このユーザはあなたの投稿やプロフィールを閲覧することもできなくなります。ブロック機能を活用する際は、Ello の外部からあなたの投稿やプロフィールが閲覧されることを防ぐため、設定画面からアカウントを非公開にすることをおすすめします。"
  );

  doc.querySelector(".delete-s1").setTooltipAndText("Delete Account?", "アカウントを削除しますか？");
  doc.querySelector(".delete-s2").setTooltipAndText("Are you sure?", "本当にアカウントを削除しますか？");

  deleting_text.childNodes[0].nodeValue = "あなたのアカウントを削除中です。";
  deleting_text.childNodes[2].nodeValue = " 秒後にリダイレクトします。";
  deleting_text.setTooltip(" Your account is in the process of being deleted. You will be redirected in ... ")

  doc.querySelectorAll(".delete__dialog p")[1].setTooltipAndText(
    "* By deleting your account you remove your personal information from Ello. Your account cannot be restored.",
    "※ Ello アカウントを削除すると、あなたの個人情報は Ello から取り除かれます。削除されたアカウントの復元はできません。"
  );

  doc.querySelector(".toolbar__discover span").childNodes[0].nodeValue = "検索";
  doc.querySelector(".toolbar__invite span").childNodes[0].nodeValue   = "招待";
  doc.querySelector(".toolbar__settings span").childNodes[0].nodeValue = "設定";

}


(function () {

  Element.prototype.setTooltip = function (title) {
    this.setAttribute("title", title);
  };

  Element.prototype.setTooltipAndText = function (title, text) {
    this.setTooltip(title);
    this.childNodes[0].nodeValue = text;
  }


  var target = document.querySelector('body');

  var config = {
    childList: true,
    subtree: true
  };

  var observer = new MutationObserver(function (mutations, self) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'childList') {
        localiseReservedPages();
      }
    });
  });

  observer.observe(target, config);

  localiseGeneralElements();
})();