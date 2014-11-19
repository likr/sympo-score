import random
import hashlib
import base64
import json
from google.appengine.api import users
from google.appengine.ext import ndb
import webapp2
from webapp2 import Route
from model import Presenter
from model import Evaluator
from model import Score


def gensalt():
    salt_length = 20
    salt_chars = (
        'abcdefghijklmnopqrstuvwxyz'
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        '0123456789'
    )
    return ''.join(random.choice(salt_chars) for _ in range(salt_length))


def genhash(password, salt):
    bytes = (password + salt).encode()
    return hashlib.md5(bytes).hexdigest()


def parseauth(header):
    hash = header.split()[-1]
    return base64.b64decode(hash).split(':')


def checkauth(header):
    if header is None:
        return None
    evaluator_key, password = parseauth(header)
    evaluator = Evaluator.get_by_id(int(evaluator_key))
    if evaluator is None:
        return None
    if evaluator.password_hash != genhash(password, evaluator.password_salt):
        return None
    return evaluator


class PresenterListHandler(webapp2.RequestHandler):
    def get(self):
        presenters = Presenter.query()
        data = json.dumps([p.to_dict() for p in presenters])
        self.response.write(data)


class AdminPresenterHandler(webapp2.RequestHandler):
    def get(self, presenter_key):
        presenter = Presenter.get_by_id(int(presenter_key))
        data = json.dumps(presenter.to_dict())
        self.response.write(data)

    def put(self, presenter_key):
        presenter = Presenter.get_by_id(int(presenter_key))
        data = json.loads(self.request.body)
        presenter.name = data.get('name')
        presenter.affiliation = data.get('affiliation')
        presenter.title = data.get('title')
        presenter.put()
        self.response.write(json.dumps(presenter.to_dict()))

    def delete(self, presenter_key):
        ndb.Key(Presenter, int(presenter_key)).delete()


class AdminPresenterListHandler(webapp2.RequestHandler):
    def get(self):
        presenters = Presenter.query()
        data = json.dumps([p.to_dict() for p in presenters])
        self.response.write(data)

    def post(self):
        data = json.loads(self.request.body)
        presenter = Presenter(
            name=data.get('name'),
            affiliation=data.get('affiliation'),
            title=data.get('title'))
        presenter.put()
        self.response.write(json.dumps(presenter.to_dict()))


class EvaluatorHandler(webapp2.RequestHandler):
    def get(self, evaluator_key):
        evaluator = checkauth(self.request.headers.get('Authorization'))
        if evaluator is None:
            self.response.set_status(401)
            return
        data = json.dumps(evaluator.to_dict())
        self.response.write(data)


class ScoreListHandler(webapp2.RequestHandler):
    def get(self, evaluator_key):
        evaluator = checkauth(self.request.headers.get('Authorization'))
        if evaluator is None:
            self.response.set_status(401)
            return
        scores = Score.query(Score.evaluator == evaluator.key)
        data = json.dumps([s.to_dict() for s in scores])
        self.response.write(data)


class ScoreHandler(webapp2.RequestHandler):
    def put(self, evaluator_key, presenter_key):
        evaluator = checkauth(self.request.headers.get('Authorization'))
        if evaluator is None:
            self.response.set_status(401)
            return
        data = json.loads(self.request.body)
        print data
        presenter_key = ndb.Key(Presenter, int(presenter_key))
        score = Score.query(Score.evaluator == evaluator.key and
                            Score.presenter == presenter_key).get()
        if score is None:
            score = Score()
            score.evaluator = evaluator.key
            score.presenter = presenter_key
        score.score1 = int(data.get('score1'))
        score.score2 = int(data.get('score2'))
        score.score3 = int(data.get('score3'))
        score.comment = data.get('comment')
        score.put()
        self.response.write(json.dumps(score.to_dict()))


class AdminEvaluatorHandler(webapp2.RequestHandler):
    def get(self, evaluator_key):
        evaluator = Evaluator.get_by_id(int(evaluator_key))
        data = json.dumps(evaluator.to_dict())
        self.response.write(data)

    def put(self, evaluator_key):
        evaluator = Evaluator.get_by_id(int(evaluator_key))
        data = json.loads(self.request.body)
        evaluator.name = data.get('name')
        evaluator.type = int(data.get('type'))
        if 'password' in data:
            evaluator.password_salt = gensalt()
            evaluator.password_hash = genhash(data.get('password'),
                                              evaluator.password_salt)
        evaluator.put()
        self.response.write(json.dumps(evaluator.to_dict()))

    def delete(self, evaluator_key):
        ndb.Key(Evaluator, int(evaluator_key)).delete()


class AdminEvaluatorListHandler(webapp2.RequestHandler):
    def get(self):
        evaluators = Evaluator.query()
        data = json.dumps([e.to_dict() for e in evaluators])
        self.response.write(data)

    def post(self):
        data = json.loads(self.request.body)
        password_salt = gensalt()
        password_hash = genhash(data.get('password'), password_salt)
        evaluator = Evaluator(
            password_hash=password_hash,
            password_salt=password_salt,
            name=data.get('name'),
            type=int(data.get('type')))
        evaluator.put()
        self.response.write(json.dumps(evaluator.to_dict()))


class AuthHandler(webapp2.RequestHandler):
    def get(self):
        dest_url = self.request.GET['dest_url']
        current_user = users.get_current_user()
        login_url = users.create_login_url(dest_url)
        data = {
            'logedIn': current_user is not None,
            'loginUrl': login_url,
            'logoutUrl': users.create_logout_url(login_url)
        }
        content = json.dumps(data)
        self.response.write(content)


app = webapp2.WSGIApplication([
    Route('/api/presenters', PresenterListHandler),
    Route('/api/admin/presenters', AdminPresenterListHandler),
    Route('/api/admin/presenters/<presenter_key:[\w\-]+>',
          AdminPresenterHandler),
    Route('/api/admin/evaluators', AdminEvaluatorListHandler),
    Route('/api/admin/evaluators/<evaluator_key:[\w\-]+>',
          AdminEvaluatorHandler),
    Route('/api/evaluators/<evaluator_key:[\w\-]+>', EvaluatorHandler),
    Route('/api/evaluators/<evaluator_key:[\w\-]+>'
          '/scores', ScoreListHandler),
    Route('/api/evaluators/<evaluator_key:[\w\-]+>'
          '/scores/<presenter_key:[\w\-]+>', ScoreHandler),
    Route('/api/auth', AuthHandler),
], debug=True)
