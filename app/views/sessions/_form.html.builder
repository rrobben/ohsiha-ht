xml << form_for(:session, url: login_path) do |f|
  f.t((t(:)username)) +
  f.text_field(:username) +
  f.label(t(:password)) +
  f.password_field(:password) +

  f.submit(t(:log_in))
end