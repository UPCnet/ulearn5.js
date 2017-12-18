from five import grok
from zope.interface import Interface
from genweb.core.browser.viewlets import gwJSViewletManager
from genweb.core.browser.viewlets import baseResourcesViewlet
from ulearn.theme.browser.interfaces import IUlearnTheme


class gwJSViewlet(baseResourcesViewlet):
    grok.context(Interface)
    grok.viewletmanager(gwJSViewletManager)
    grok.layer(IUlearnTheme)

    resource_type = 'js'
    current_egg_name = 'ulearn5.js'
