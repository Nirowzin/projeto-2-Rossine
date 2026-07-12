from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.network.urlrequest import UrlRequest
import json

class LoginScreen(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(orientation='vertical', padding=40, spacing=10, **kwargs)

        self.add_widget(Label(text="Login", font_size=32, size_hint_y=None, height=80))

        self.email = TextInput(hint_text="E-mail", multiline=False, size_hint_y=None, height=40)
        self.add_widget(self.email)

        self.password = TextInput(hint_text="Senha", password=True, multiline=False, size_hint_y=None, height=40)
        self.add_widget(self.password)

        self.error_label = Label(text="", color=(1, 0, 0, 1), size_hint_y=None, height=30)
        self.add_widget(self.error_label)

        btn_login = Button(text="Entrar", size_hint_y=None, height=50, background_color=(0.1, 0.5, 0.8, 1))
        btn_login.bind(on_press=self.do_login)
        self.add_widget(btn_login)

    def do_login(self, instance):
        payload = json.dumps({"email": self.email.text, "password": self.password.text})
        headers = {'Content-type': 'application/json', 'Accept': 'application/json'}
        # Ajuste a URL para o servidor correto
        UrlRequest("http://10.0.2.2:8000/api/v1/login", req_body=payload, req_headers=headers, 
                   on_success=self.on_success, on_failure=self.on_failure, on_error=self.on_error)

    def on_success(self, req, result):
        self.error_label.color = (0, 1, 0, 1)
        self.error_label.text = "Login efetuado com sucesso!"
        # Guardar Token e ir para a próxima tela

    def on_failure(self, req, result):
        self.error_label.color = (1, 0, 0, 1)
        self.error_label.text = "Credenciais inválidas!"

    def on_error(self, req, error):
        self.error_label.color = (1, 0, 0, 1)
        self.error_label.text = "Erro de conexão!"

class MultiplatformApp(App):
    def build(self):
        return LoginScreen()

if __name__ == '__main__':
    MultiplatformApp().run()
