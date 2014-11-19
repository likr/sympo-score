from google.appengine.ext import ndb


class Presenter(ndb.Model):
    name = ndb.StringProperty(required=True)
    affiliation = ndb.StringProperty(required=True)
    title = ndb.StringProperty(required=True)
    order = ndb.IntegerProperty(required=True)
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)

    def to_dict(self):
        return {
            'key': self.key.id(),
            'name': self.name,
            'affiliation': self.affiliation,
            'title': self.title,
            'order': self.order,
            'created': self.created.strftime('%Y-%m-%dT%H:%M:%SZ'),
            'updated': self.updated.strftime('%Y-%m-%dT%H:%M:%SZ'),
        }


class Evaluator(ndb.Model):
    password_hash = ndb.StringProperty(required=True)
    password_salt = ndb.StringProperty(required=True)
    name = ndb.StringProperty(required=True)
    type = ndb.IntegerProperty(required=True)
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)

    def to_dict(self):
        return {
            'key': self.key.id(),
            'name': self.name,
            'type': self.type,
            'created': self.created.strftime('%Y-%m-%dT%H:%M:%SZ'),
            'updated': self.updated.strftime('%Y-%m-%dT%H:%M:%SZ'),
        }


class Score(ndb.Model):
    score1 = ndb.IntegerProperty(required=True)
    score2 = ndb.IntegerProperty(required=True)
    score3 = ndb.IntegerProperty(required=True)
    comment = ndb.TextProperty(required=True)
    presenter = ndb.KeyProperty(required=True, kind=Presenter)
    evaluator = ndb.KeyProperty(required=True, kind=Evaluator)
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)

    def to_dict(self):
        return {
            'key': self.key.id(),
            'score1': self.score1,
            'score2': self.score2,
            'score3': self.score3,
            'comment': self.comment,
            'presenterKey': self.presenter.id(),
            'evaluatorKey': self.evaluator.id(),
            'created': self.created.strftime('%Y-%m-%dT%H:%M:%SZ'),
            'updated': self.updated.strftime('%Y-%m-%dT%H:%M:%SZ'),
        }
