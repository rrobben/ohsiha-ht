xml << form_for(:session, url: login_path) do |f|
  f.label(t(:username)) +
  f.text_field(:username) +
  f.label(t(:password)) +
  f.password_field(:password) +

  f.submit(t(:log_in))
end

xml << link_to(t(:new_user), new_user_path)