from plone.app.layout.viewlets import ViewletBase
from ulearn5.theme.interfaces import IUlearn5ThemeLayer
from zope.interface import Interface
from plone.app.layout.viewlets.interfaces import IAboveContent
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from plone import api

class GwJSViewlet(ViewletBase):
    """Viewlet para incluir un archivo JS en la vista."""

    resource_type = 'js'
    current_egg_name = 'ulearn5.js'

    def is_devel_mode(self):
        return api.env.debug_mode()

    def update(self):
        self.devel_mode = self.is_devel_mode()

    def render(self):
        if self.devel_mode:
            template = ViewPageTemplateFile('viewlets_templates/gwjsdevelviewlet.pt')
        else:
            template = ViewPageTemplateFile('viewlets_templates/gwjsproductionviewlet.pt')
        return template(self)

# class gwJSDevelViewlet(grok.Viewlet):
#     grok.context(Interface)
#     grok.viewletmanager(baseJSViewletManager)
#     grok.layer(IUlearn5ThemeLayer)

#     def is_devel_mode(self):
#         return api.env.debug_mode()


# class gwJSProductionViewlet(grok.Viewlet):
#     grok.context(Interface)
#     grok.viewletmanager(baseJSViewletManager)
#     grok.layer(IUlearn5ThemeLayer)

#     def is_devel_mode(self):
#         return api.env.debug_mode()
