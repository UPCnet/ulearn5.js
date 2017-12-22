from five import grok
from zope.interface import Interface
from base5.core.browser.viewlets import gwJSViewletManager
from base5.core.browser.viewlets import baseResourcesViewlet
from ulearn5.theme.interfaces import IUlearn5ThemeLayer
from plone import api


class gwJSViewlet(baseResourcesViewlet):
    grok.context(Interface)
    grok.viewletmanager(gwJSViewletManager)
    grok.layer(IUlearn5ThemeLayer)

    resource_type = 'js'
    current_egg_name = 'ulearn5.js'


class gwJSDevelViewlet(grok.Viewlet):
    grok.context(Interface)
    grok.viewletmanager(gwJSViewletManager)
    grok.layer(IUlearn5ThemeLayer)

    def is_devel_mode(self):
        return api.env.debug_mode()


class gwJSProductionViewlet(grok.Viewlet):
    grok.context(Interface)
    grok.viewletmanager(gwJSViewletManager)
    grok.layer(IUlearn5ThemeLayer)

    def is_devel_mode(self):
        return api.env.debug_mode()
